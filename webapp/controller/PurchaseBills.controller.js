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

	return BaseController.extend("com.raahassociates.launchpad.controller.PurchaseBills", {
		onInit: function () {
			var oViewModel;
			// Model used to manipulate control states
			oViewModel = new JSONModel({
				NoOfPurchaseBills: "0",
				PurchaseBillAction: "Add",
				Suppliers: [],
				DeleteVisible: true,
				EditVisible: true,
				SubmitVisible: true,
				PurchaseBillFormEditable: true,
				PurchaseBills: [],
				PurchaseBillItem: {
					supplierid: "",
					description: "",
					billdate: "",
					billdate1: new Date(),
					billno: "",
					amount: "",
					gstamount: "",
					totalamount: "",
					active: "1",
					active1: true
				}
			});
			this.setModel(oViewModel, "viewData");
			this.getRouter().getRoute("PurchaseBills").attachMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function () {
			this._getSuppliers();
			this._getPurchaseBills();
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
			} else {
				MessageToast.show(oData.message);
			}
		},

		_onReadPurchaseBillsFailed: function () {
			this.getBusyDialog().close();
		},

		onPurchaseBillUpdateFinished: function (oEvent) {
			// update the project's object counter after the table update
			var oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				this.getModel("viewData").setProperty("/NoOfPurchaseBills", iTotalItems);
			} else {
				this.getModel("viewData").setProperty("/NoOfPurchaseBills", "0");
			}
		},
		onAddPurchaseBill: function () {
			var PurchaseBillItem = {
				supplierid: "",
				description: "",
				billdate: "",
				billdate1: new Date(),
				billno: "",
				amount: "",
				gstamount: "",
				totalamount: "",
				active: "1",
				active1: true
			};
			this.getModel("viewData").setProperty("/PurchaseBillItem", PurchaseBillItem);
			this._getPurchaseBillDialog().open();
		},

		onSubmitPurchaseBill: function () {
			var oViewModel = this.getModel("viewData"),
				oPayloadObj = oViewModel.getProperty("/PurchaseBillItem");
			oPayloadObj.active = oPayloadObj.active1 ? "1" : "0";
			oPayloadObj.billdate = this._getFormattedDateStr(oPayloadObj.billdate1);
			oPayloadObj.suppliername = this.getValueFromKey(oViewModel.getProperty("/Suppliers"), oPayloadObj.supplierid, "id", "name");
			if (this._isDataValid(oPayloadObj)) {
				var sUrl, oModel = new JSONModel(),
					sUserAction = oViewModel.getProperty("/PurchaseBillAction");
				if (sUserAction === "Add") {
					sUrl = "/api/purchasebill/create";
				} else if (sUserAction === "Edit") {
					sUrl = "/api/purchasebill/update";
				}
				delete oPayloadObj.active1;
				delete oPayloadObj.billdate1;
				oModel.attachRequestCompleted(this._onCreatePurchaseBillComplete, this);
				oModel.attachRequestFailed(this._onCreatePurchaseBillFailed, this);
				this.getBusyDialog().open();
				oModel.loadData(sUrl, JSON.stringify(oPayloadObj), true,
					"POST", false, false, {
						"Accept": "*/*",
						"Content-Type": "application/json; charset=UTF-8"
					});
			}

		},

		_onCreatePurchaseBillComplete: function (oEvent) {
			this.getBusyDialog().close();
			var oData = oEvent.getSource().getData();
			if (oData.success) {
				MessageToast.show(oData.message);
				this._getPurchaseBillDialog().close();
				this._getPurchaseBills();
			} else {
				MessageToast.show(oData.message);
			}
		},

		_onCreatePurchaseBillFailed: function () {
			this.getBusyDialog().close();
		},

		_isDataValid: function (oData) {
			var bIsValid = true,
				aFields = [];
			if (!oData.supplierid) {
				aFields.push("Supplier");
			}
			if (!oData.billdate) {
				aFields.push("Bill Date");
			}
			if (!oData.billno) {
				aFields.push("Bill Number");
			}
			if (!oData.amount) {
				aFields.push("Amount");
			}
			if (!oData.gstamount) {
				aFields.push("GST Amount");
			}
			if (!oData.totalamount) {
				aFields.push("Total Amount");
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

		onCancelPurchaseBill: function () {
			this._getPurchaseBillDialog().close();
		},

		_getPurchaseBillDialogId: function () {
			return this.createId("pbDialog");
		},

		_getPurchaseBillDialog: function () {
			var oView = this.getView();
			if (!this._oPurchaseBillDialog) {
				this._oPurchaseBillDialog = sap.ui.xmlfragment(this._getPurchaseBillDialogId(),
					"com.raahassociates.launchpad.fragment.PurchaseBillDialog", this);
			}
			oView.addDependent(this._oPurchaseBillDialog);
			jQuery.sap.syncStyleClass(this.getOwnerComponent().getContentDensityClass(), oView, this._oPurchaseBillDialog);
			return this._oPurchaseBillDialog;
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