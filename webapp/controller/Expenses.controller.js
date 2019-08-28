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

	return BaseController.extend("com.raahassociates.launchpad.controller.Expenses", {

		_sSupplier: "",

		onInit: function () {
			var oViewModel;
			// Model used to manipulate control states
			oViewModel = new JSONModel({
				NoOfExpenses: "0",
				UserAction: "Add",
				Expenses: [],
				Sites: [],
				Users: [],
				Suppliers: [],
				PurchaseBills: [],
				PurchaseBillDate: null,
				ExpenseItem: {
					towardsid: "",
					category: "Supervisor",
					purchasebillno: "",
					totalamount: "",
					imprest1: false,
					siteid: "",
					description: "",
					expensedate1: new Date()
				}
			});
			this.setModel(oViewModel, "viewData");
			this.getRouter().getRoute("Expenses").attachMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function () {
			this._getSites();
			this._getUsers();
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

		_getUsers: function () {
			var oModel = new JSONModel();
			oModel.attachRequestCompleted(this._onReadUsersComplete, this);
			oModel.attachRequestFailed(this._onReadUsersFailed, this);
			this.getBusyDialog().open();
			oModel.loadData("/api/user/read", null, true,
				"GET", false, false, {
					"Accept": "*/*",
					"Content-Type": "application/json; charset=UTF-8"
				});
		},

		_onReadUsersComplete: function (oEvent) {
			this.getBusyDialog().close();
			var oData = oEvent.getSource().getData();
			if (oData.success) {
				this.getModel("viewData").setProperty("/Users", oData.records);
			} else {
				MessageToast.show(oData.message);
			}
		},

		_onReadUsersFailed: function () {
			this.getBusyDialog().close();
		},

		_getExpenses: function () {
			var oModel = new JSONModel();
			oModel.attachRequestCompleted(this._onReadExpensesComplete, this);
			oModel.attachRequestFailed(this._onReadExpensesFailed, this);
			this.getBusyDialog().open();
			oModel.loadData("/api/expense/read", null, true,
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

		onCategoryChange: function (oEvent) {
			var sCategory = oEvent.getSource().getSelectedKey();
			if (sCategory === "Supplier") {
				this._getSuppliers();
			}
		},

		_getSuppliers: function () {
			var oModel = new JSONModel();
			oModel.attachRequestCompleted(this._onReadSuppliersComplete, this);
			oModel.attachRequestFailed(this._onReadSuppliersFailed, this);
			this.getBusyDialog().open();
			oModel.loadData("/api/supplier/read", null, true,
				"GET", false, false, {
					"Accept": "*/*",
					"Content-Type": "application/json; charset=UTF-8"
				});
		},

		_onReadSuppliersComplete: function (oEvent) {
			this.getBusyDialog().close();
			var oData = oEvent.getSource().getData();
			if (oData.success) {
				this.getModel("viewData").setProperty("/Suppliers", oData.records);
			} else {
				MessageToast.show(oData.message);
			}
		},

		_onReadSuppliersFailed: function () {
			this.getBusyDialog().close();
		},

		onSupplierChange: function (oEvent) {
			var sSupplier = oEvent.getSource().getSelectedKey();
			this._sSupplier = sSupplier ? sSupplier : "";
			this._getPurchaseBills();
		},

		_getPurchaseBills: function () {
			var oModel = new JSONModel();
			oModel.attachRequestCompleted(this._onReadPurchaseBillsComplete, this);
			oModel.attachRequestFailed(this._onReadPurchaseBillsFailed, this);
			this.getBusyDialog().open();
			oModel.loadData("/api/purchasebill/read", null, true,
				"GET", false, false, {
					"Accept": "*/*",
					"Content-Type": "application/json; charset=UTF-8"
				});
		},

		_onReadPurchaseBillsComplete: function (oEvent) {
			this.getBusyDialog().close();
			var oData = oEvent.getSource().getData();
			if (oData.success) {
				this.getModel("viewData").setProperty("/PurchaseBills", oData.records);
				setTimeout(function(){
					var aFilters = [
						new Filter("supplierid", FilterOperator.Contains, this._sSupplier)
					],
					oFilter = new Filter({
						filters: aFilters,
						and: false
					});
				this.getFragmentControl("expDialog","idPurchaseBillsCB").getBinding("items").filter([oFilter]);
				}.bind(this), 500);
			} else {
				MessageToast.show(oData.message);
			}
		},

		_onReadPurchaseBillsFailed: function () {
			this.getBusyDialog().close();
		},
		
		onPurchaseBillChange: function(oEvent){
			var sBillDate = oEvent.getParameter("selectedItem").getBindingContext("viewData").getProperty("billdate");
			this.getModel("viewData").setProperty("/PurchaseBillDate", sBillDate);
		},
		
		onAddExpense: function () {
			this._getExpenseDialog().open();
		},

		onEditExpense: function () {
			var oTable = this.byId("idExpensesTable"),
				oSelItem = oTable.getSelectedItem(),
				oSelCtx = oSelItem.getBindingContext().getObject();
			this.getModel("viewData").setProperty("/ExpenseItem", oSelCtx);
			this._getExpenseDialog().open();
		},

		onSubmitExpense: function () {
			var oViewModel = this.getModel("viewData"),
				oPayloadObj = oViewModel.getProperty("/ExpenseItem");
			oPayloadObj.imprest = oPayloadObj.imprest1 ? "1" : "0";
			oPayloadObj.site = this.getValueFromKey(oViewModel.getProperty("/Sites"), oPayloadObj.siteid, "id", "name");
			oPayloadObj.expensedate = this._getFormattedDateStr(oPayloadObj.expensedate1);
			if(oPayloadObj.category === "Others"){
				oPayloadObj.towardsid = "";
				oPayloadObj.imprest = "0";
				oPayloadObj.purchasebillno = "";
				oPayloadObj.supplierid = "";
				oPayloadObj.suppliername = "";
			}else if(oPayloadObj.category === "Supervisor"){
				oPayloadObj.towards = this.getValueFromKey(oViewModel.getProperty("/Users"), oPayloadObj.towardsid, "id", "username");
				oPayloadObj.purchasebillno = "";
				oPayloadObj.supplierid = "";
				oPayloadObj.suppliername = "";
			}else if(oPayloadObj.category === "Supplier"){	
				oPayloadObj.towards = this.getValueFromKey(oViewModel.getProperty("/Suppliers"), oPayloadObj.supplierid, "id", "name");
				oPayloadObj.imprest = "0";
			}
			if (this._isDataValid(oPayloadObj)) {
				var sUrl, oModel = new JSONModel(),
					sUserAction = oViewModel.getProperty("/UserAction");
				if (sUserAction === "Add") {
					sUrl = "/api/expense/create";
				} else if (sUserAction === "Edit") {
					sUrl = "/api/expense/update";
				}
				delete oPayloadObj.expensedate1;
				delete oPayloadObj.imprest1;
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
			if (!oData.towards) {
				aFields.push("Towards");
			}
			if (!oData.siteid) {
				aFields.push("Site");
			}
			if (!oData.description) {
				aFields.push("Description");
			}
			if (!oData.expensedate) {
				aFields.push("Expense Date");
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
				this._oExpenseDialog = sap.ui.xmlfragment(this._getExpenseDialogId(), "com.raahassociates.launchpad.fragment.ExpenseDialog", this);
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