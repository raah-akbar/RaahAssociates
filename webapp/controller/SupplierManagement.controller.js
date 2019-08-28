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

	return BaseController.extend("com.raahassociates.launchpad.controller.SupplierManagement", {
		onInit: function () {
			var oViewModel;
			// Model used to manipulate control states
			oViewModel = new JSONModel({
				NoOfSuppliers: "0",
				SupplierAction: "Display",
				DeleteVisible: true,
				EditVisible: true,
				SubmitVisible: false,
				SupplierFormEditable: false,
				Suppliers: [],
				SupplierItem: {
					name: "",
					description: "",
					phone: "",
					email: "",
					accountno: "",
					ifsccode: "",
					bankname: "",
					bankbranch: "",
					active: "1",
					active1: true
				}
			});
			this.setModel(oViewModel, "viewData");
			this.getRouter().getRoute("SupplierManagement").attachMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function () {
			this._getSuppliers();
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

		onSupplierUpdateFinished: function (oEvent) {
			// update the project's object counter after the table update
			var oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				this.getModel("viewData").setProperty("/NoOfSuppliers", iTotalItems);
			} else {
				this.getModel("viewData").setProperty("/NoOfSuppliers", "0");
			}
		},

		onDisplaySupplier: function (oEvent) {
			var oSupplier = oEvent.getSource().getBindingContext("viewData").getObject(),
				oViewModel = this.getModel("viewData");
			oSupplier.active1 = oSupplier.active === "1" ? true : false;
			oViewModel.setProperty("/SupplierItem", jQuery.extend(true, {}, oSupplier));
			oViewModel.setProperty("/SupplierAction", "Display");
			oViewModel.setProperty("/SupplierFormEditable", false);
			oViewModel.setProperty("/DeleteVisible", true);
			oViewModel.setProperty("/EditVisible", true);
			oViewModel.setProperty("/SubmitVisible", false);
			this._getSupplierDialog().open();
		},

		onAddSupplier: function () {
			var oSupplierItem = {
					name: "",
					description: "",
					phone: "",
					email: "",
					accountno: "",
					ifsccode: "",
					bankname: "",
					bankbranch: "",
					active: "1",
					active1: true
				},
			oViewModel = this.getModel("viewData");
			oViewModel.setProperty("/SupplierItem", oSupplierItem);
			oViewModel.setProperty("/SupplierAction", "Add");
			oViewModel.setProperty("/SupplierFormEditable", true);
			oViewModel.setProperty("/DeleteVisible", false);
			oViewModel.setProperty("/EditVisible", false);
			oViewModel.setProperty("/SubmitVisible", true);
			this._getSupplierDialog().open();
		},

		onEditSupplier: function () {
			var oViewModel = this.getModel("viewData");
			oViewModel.setProperty("/SupplierAction", "Edit");
			oViewModel.setProperty("/SupplierFormEditable", true);
			oViewModel.setProperty("/DeleteVisible", false);
			oViewModel.setProperty("/EditVisible", false);
			oViewModel.setProperty("/SubmitVisible", true);
			this._getSupplierDialog().open();
		},
		
		onDeleteSupplier: function () {
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.confirm("Are you sure you want to delete Supplier ?", {
				styleClass: bCompact ? "sapUiSizeCompact" : "",
				onClose: function(oAction) { 
					if(oAction === MessageBox.Action.OK){
						var oViewModel = this.getModel("viewData"),
						oModel = new JSONModel(),
						oPayloadObj = {};
						oPayloadObj.id = oViewModel.getProperty("/SupplierItem/id");
						oModel.attachRequestCompleted(this._onDeleteSupplierComplete, this);
						oModel.attachRequestFailed(this._onDeleteSupplierFailed, this);
						this.getBusyDialog().open();
						oModel.loadData("/api/supplier/delete", JSON.stringify(oPayloadObj), true,
							"POST", false, false, {
								"Accept": "*/*",
								"Content-Type": "application/json; charset=UTF-8"
						});
					}
				}.bind(this)
			});
		},

		_onDeleteSupplierComplete: function (oEvent) {
			this.getBusyDialog().close();
			var oData = oEvent.getSource().getData();
			if (oData.success) {
				MessageToast.show(oData.message);
				this._getSupplierDialog().close();
				this._getSuppliers();
			} else {
				MessageToast.show(oData.message);
			}
		},

		_onDeleteSupplierFailed: function () {
			this.getBusyDialog().close();
		},

		onSubmitSupplier: function () {
			var oViewModel = this.getModel("viewData"),
			oPayloadObj = oViewModel.getProperty("/SupplierItem");
			oPayloadObj.active = oPayloadObj.active1 ? "1" : "0";
			if(this._isDataValid(oPayloadObj)){
				var sUrl, oModel = new JSONModel(),
				sSupplierAction = oViewModel.getProperty("/SupplierAction");
				if(sSupplierAction === "Add"){
					sUrl = "/api/supplier/create";
				}else if(sSupplierAction === "Edit"){
					sUrl = "/api/supplier/update";
				}
				delete oPayloadObj.active1;
				oModel.attachRequestCompleted(this._onCreateSupplierComplete, this);
				oModel.attachRequestFailed(this._onCreateSupplierFailed, this);
				this.getBusyDialog().open();
				oModel.loadData(sUrl, JSON.stringify(oPayloadObj), true,
					"POST", false, false, {
						"Accept": "*/*",
						"Content-Type": "application/json; charset=UTF-8"
				});
			}
		},
		
		_isDataValid: function(oData){
			var bIsValid = true, aFields = [];
			if(!oData.name){
				aFields.push("Supplier Name");
			}
			if(!oData.description){
				aFields.push("Description");
			}
			if(aFields.length > 0){
				bIsValid = false;
				var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length,
				sMessage = aFields.join(", ");
				MessageBox.alert(sMessage + " is/are mandatory.", {
					styleClass: bCompact ? "sapUiSizeCompact" : ""
				});
			}
			return bIsValid;
		},

		_onCreateSupplierComplete: function (oEvent) {
			this.getBusyDialog().close();
			var oData = oEvent.getSource().getData();
			if (oData.success) {
				MessageToast.show(oData.message);
				this._getSupplierDialog().close();
				this._getSuppliers();
			} else {
				MessageToast.show(oData.message);
			}
		},

		_onCreateSupplierFailed: function () {
			this.getBusyDialog().close();
		},
		
		onSearchSupplier: function(oEvent){
			var sValue = oEvent.getParameter("newValue"),
			aFilters = [
				new Filter("name", FilterOperator.Contains, sValue),
				new Filter("description", FilterOperator.Contains, sValue)
			],
			oFilter = new Filter({
					filters: aFilters,
					and: false
				});
			this.byId("idSuppliersTable").getBinding("items").filter([oFilter]);
		},

		onCancelSupplier: function () {
			this._getSupplierDialog().close();
		},

		_getSupplierDialogId: function () {
			return this.createId("supplierDialog");
		},

		_getSupplierDialog: function () {
			var oView = this.getView();
			if (!this._oSupplierDialog) {
				this._oSupplierDialog = sap.ui.xmlfragment(this._getSupplierDialogId(), "com.raahassociates.launchpad.fragment.SupplierDialog", this);
			}
			oView.addDependent(this._oSupplierDialog);
			jQuery.sap.syncStyleClass(this.getOwnerComponent().getContentDensityClass(), oView, this._oSupplierDialog);
			return this._oSupplierDialog;
		},
		
		_getFormattedDateStr: function(oDate){
			var oDateFormat = DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd HH:mm:ss" });   
			return oDateFormat.format(oDate);
		},
		
		_getFormattedDate: function(sDate){
			var oDateFormat = DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd HH:mm:ss" });   
			return oDateFormat.parse(sDate);
		}
	});
});