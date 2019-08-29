sap.ui.define([
	"com/raahassociates/launchpad/controller/BaseController",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	"sap/ui/core/format/DateFormat"
], function (BaseController, MessageToast, JSONModel, Filter, FilterOperator, MessageBox, DateFormat) {
	"use strict";

	return BaseController.extend("com.raahassociates.launchpad.controller.ExpenseBreakup", {
		onInit: function () {
			var oViewModel;
			// Model used to manipulate control states
			oViewModel = new JSONModel({
				NoOfExpenses: "0",
				UserAction: "Add",
				Expenses: [],
				Sites: [],
				ExpenseInfo: [{
					Name: "Total Amount",
					Amount: "9000"
				}, {
					Name: "Spent Amount",
					Amount: "5000"
				}, {
					Name: "Balance Amount",
					Amount: "4000"
				}],
				ExpenseItem: {
					siteid: "",
					towards: "",
					amount: "",
					description: "",
					expensedate1: new Date()
				}
			});
			this.setModel(oViewModel, "viewData");
			this.getRouter().getRoute("ExpenseBreakup").attachMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function () {
			this._getSites();
			this._getExpenses();
		},

		_getSites: function () {
			var oModel = new JSONModel();
			oModel.attachRequestCompleted(this._onReadSitesComplete, this);
			oModel.attachRequestFailed(this._onReadSitesFailed, this);
			this.getBusyDialog().open();
			oModel.loadData("/api/site/read", null, true,
				"GET", false, false, {
					"Accept": "*/*",
					"Content-Type": "application/json; charset=UTF-8"
				});
		},

		_onReadSitesComplete: function (oEvent) {
			this.getBusyDialog().close();
			var oData = oEvent.getSource().getData();
			if (oData.success) {
				this.getModel("viewData").setProperty("/Sites", oData.records);
			} else {
				MessageToast.show(oData.message);
			}
		},

		_onReadSitesFailed: function () {
			this.getBusyDialog().close();
		},

		_getExpenses: function () {
			var oModel = new JSONModel();
			oModel.attachRequestCompleted(this._onReadExpensesComplete, this);
			oModel.attachRequestFailed(this._onReadExpensesFailed, this);
			this.getBusyDialog().open();
			oModel.loadData("/api/expensebreakup/read", null, true,
				"GET", false, false, {
					"Accept": "*/*",
					"Content-Type": "application/json; charset=UTF-8"
				});
		},

		_onReadExpensesComplete: function (oEvent) {
			this.getBusyDialog().close();
			var oData = oEvent.getSource().getData();
			if (oData.success) {
				this.getModel("viewData").setProperty("/Expenses", oData.records);
			} else {
				MessageToast.show(oData.message);
			}
		},

		_onReadExpensesFailed: function () {
			this.getBusyDialog().close();
		},

		onExpenseUpdateFinished: function (oEvent) {
			// update the project's object counter after the table update
			var oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				this.getModel("viewData").setProperty("/NoOfExpenses", iTotalItems);
			} else {
				this.getModel("viewData").setProperty("/NoOfExpenses", "0");
			}
		},
		onAddExpense: function () {
			var oExpItem = {
				siteid: "",
				towards: "",
				amount: "",
				description: "",
				expensedate1: new Date()
			};
			this.getModel("viewData").setProperty("/ExpenseItem", oExpItem);
			this._getExpenseDialog().open();
		},

		onSubmitExpense: function () {
			var oViewModel = this.getModel("viewData"),
				oPayloadObj = oViewModel.getProperty("/ExpenseItem");
			oPayloadObj.expensedate = this._getFormattedDateStr(oPayloadObj.expensedate1);
			oPayloadObj.userid = this.getModel("user").getProperty("/id");
			if (this._isDataValid(oPayloadObj)) {
				var sUrl, oModel = new JSONModel(),
					sUserAction = oViewModel.getProperty("/UserAction");
				if (sUserAction === "Add") {
					sUrl = "/api/expensebreakup/create";
				} else if (sUserAction === "Edit") {
					sUrl = "/api/expensebreakup/update";
				}
				delete oPayloadObj.expensedate1;
				oModel.attachRequestCompleted(this._onCreateExpenseComplete, this);
				oModel.attachRequestFailed(this._onCreateExpenseFailed, this);
				this.getBusyDialog().open();
				oModel.loadData(sUrl, JSON.stringify(oPayloadObj), true,
					"POST", false, false, {
						"Accept": "*/*",
						"Content-Type": "application/json; charset=UTF-8"
					});
			}

		},

		_onCreateExpenseComplete: function (oEvent) {
			this.getBusyDialog().close();
			var oData = oEvent.getSource().getData();
			if (oData.success) {
				MessageToast.show(oData.message);
				this._getExpenseDialog().close();
				this._getExpenses();
			} else {
				MessageToast.show(oData.message);
			}
		},

		_onCreateExpenseFailed: function () {
			this.getBusyDialog().close();
		},

		_isDataValid: function (oData) {
			var bIsValid = true,
				aFields = [];
			if (!oData.siteid) {
				aFields.push("Site");
			}
			if (!oData.towards) {
				aFields.push("Towards");
			}
			if (!oData.expensedate) {
				aFields.push("Expense Date");
			}
			if (!oData.amount) {
				aFields.push("Amount");
			}
			if (!oData.description) {
				aFields.push("Description");
			}
			if (aFields.length > 0) {
				bIsValid = false;
				var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length,
					sMessage = aFields.join(", ");
				MessageBox.alert(sMessage + " is/are mandatory.", {
					styleClass: bCompact ? "sapUiSizeCompact" : ""
				});
			}
			return bIsValid;
		},

		onCancelExpense: function () {
			this._getExpenseDialog().close();
		},

		_getExpenseDialogId: function () {
			return this.createId("expDialog");
		},

		_getExpenseDialog: function () {
			var oView = this.getView();
			if (!this._oExpenseDialog) {
				this._oExpenseDialog = sap.ui.xmlfragment(this._getExpenseDialogId(), "com.raahassociates.launchpad.fragment.ExpenseBreakupDialog",
					this);
			}
			oView.addDependent(this._oExpenseDialog);
			jQuery.sap.syncStyleClass(this.getOwnerComponent().getContentDensityClass(), oView, this._oExpenseDialog);
			return this._oExpenseDialog;
		},

		_getFormattedDateStr: function (oDate) {
			var oDateFormat = DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd HH:mm:ss"
			});
			return oDateFormat.format(oDate);
		},

		_getFormattedDate: function (sDate) {
			var oDateFormat = DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd HH:mm:ss"
			});
			return oDateFormat.parse(sDate);
		}
	});
});