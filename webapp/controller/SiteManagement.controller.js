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

	return BaseController.extend("com.raahassociates.launchpad.controller.SiteManagement", {
		onInit: function () {
			var oViewModel;
			// Model used to manipulate control states
			oViewModel = new JSONModel({
				NoOfSites: "0",
				SiteAction: "Display",
				DeleteVisible: true,
				EditVisible: true,
				SubmitVisible: false,
				SiteFormEditable: false,
				Sites: [],
				SiteItem: {
					name: "",
					description: "",
					location: "",
					startdate: "",
					startdate1: new Date(),
					enddate: "",
					enddate1: null,
					active: "1",
					active1: true
				}
			});
			this.setModel(oViewModel, "viewData");
			this.getRouter().getRoute("SiteManagement").attachMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function () {
			this._getSites();
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

		onSiteUpdateFinished: function (oEvent) {
			// update the project's object counter after the table update
			var oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				this.getModel("viewData").setProperty("/NoOfSites", iTotalItems);
			} else {
				this.getModel("viewData").setProperty("/NoOfSites", "0");
			}
		},

		onDisplaySite: function (oEvent) {
			var oSite = oEvent.getSource().getBindingContext("viewData").getObject(),
				oViewModel = this.getModel("viewData");
			oSite.active1 = oSite.active === "1" ? true : false;
			oSite.startdate1 = this._getFormattedDate(oSite.startdate);
			oSite.enddate1 = oSite.enddate ? this._getFormattedDate(oSite.enddate) : null;
			oViewModel.setProperty("/SiteItem", jQuery.extend(true, {}, oSite));
			oViewModel.setProperty("/SiteAction", "Display");
			oViewModel.setProperty("/SiteFormEditable", false);
			oViewModel.setProperty("/DeleteVisible", true);
			oViewModel.setProperty("/EditVisible", true);
			oViewModel.setProperty("/SubmitVisible", false);
			this._getSiteDialog().open();
		},

		onAddSite: function () {
			var oSiteItem = {
					name: "",
					description: "",
					location: "",
					startdate: "",
					startdate1: new Date(),
					enddate: "",
					enddate1: null,
					active: "1",
					active1: true
				},
			oViewModel = this.getModel("viewData");
			oViewModel.setProperty("/SiteItem", oSiteItem);
			oViewModel.setProperty("/SiteAction", "Add");
			oViewModel.setProperty("/SiteFormEditable", true);
			oViewModel.setProperty("/DeleteVisible", false);
			oViewModel.setProperty("/EditVisible", false);
			oViewModel.setProperty("/SubmitVisible", true);
			this._getSiteDialog().open();
		},

		onEditSite: function () {
			var oViewModel = this.getModel("viewData");
			oViewModel.setProperty("/SiteAction", "Edit");
			oViewModel.setProperty("/SiteFormEditable", true);
			oViewModel.setProperty("/DeleteVisible", false);
			oViewModel.setProperty("/EditVisible", false);
			oViewModel.setProperty("/SubmitVisible", true);
			this._getSiteDialog().open();
		},
		
		onDeleteSite: function () {
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.confirm("Are you sure you want to delete site ?", {
				styleClass: bCompact ? "sapUiSizeCompact" : "",
				onClose: function(oAction) { 
					if(oAction === MessageBox.Action.OK){
						var oViewModel = this.getModel("viewData"),
						oModel = new JSONModel(),
						oPayloadObj = {};
						oPayloadObj.id = oViewModel.getProperty("/SiteItem/id");
						oModel.attachRequestCompleted(this._onDeleteSiteComplete, this);
						oModel.attachRequestFailed(this._onDeleteSiteFailed, this);
						this.getBusyDialog().open();
						oModel.loadData("/api/site/delete", JSON.stringify(oPayloadObj), true,
							"POST", false, false, {
								"Accept": "*/*",
								"Content-Type": "application/json; charset=UTF-8"
						});
					}
				}.bind(this)
			});
		},

		_onDeleteSiteComplete: function (oEvent) {
			this.getBusyDialog().close();
			var oData = oEvent.getSource().getData();
			if (oData.success) {
				MessageToast.show(oData.message);
				this._getSiteDialog().close();
				this._getSites();
			} else {
				MessageToast.show(oData.message);
			}
		},

		_onDeleteSiteFailed: function () {
			this.getBusyDialog().close();
		},

		onSubmitSite: function () {
			var oViewModel = this.getModel("viewData"),
			oPayloadObj = oViewModel.getProperty("/SiteItem");
			oPayloadObj.active = oPayloadObj.active1 ? "1" : "0";
			oPayloadObj.startdate = this._getFormattedDateStr(oPayloadObj.startdate1);
			oPayloadObj.enddate = oPayloadObj.enddate1 ? this._getFormattedDateStr(oPayloadObj.enddate1) : "";
			if(this._isDataValid(oPayloadObj)){
				var sUrl, oModel = new JSONModel(),
				sSiteAction = oViewModel.getProperty("/SiteAction");
				if(sSiteAction === "Add"){
					sUrl = "/api/site/create";
				}else if(sSiteAction === "Edit"){
					sUrl = "/api/site/update";
				}
				delete oPayloadObj.active1;
				delete oPayloadObj.startdate1;
				delete oPayloadObj.enddate1;
				oModel.attachRequestCompleted(this._onCreateSiteComplete, this);
				oModel.attachRequestFailed(this._onCreateSiteFailed, this);
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
				aFields.push("Site Name");
			}
			if(!oData.description){
				aFields.push("Description");
			}
			if(!oData.startdate){
				aFields.push("Start Date");
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

		_onCreateSiteComplete: function (oEvent) {
			this.getBusyDialog().close();
			var oData = oEvent.getSource().getData();
			if (oData.success) {
				MessageToast.show(oData.message);
				this._getSiteDialog().close();
				this._getSites();
			} else {
				MessageToast.show(oData.message);
			}
		},

		_onCreateSiteFailed: function () {
			this.getBusyDialog().close();
		},
		
		onSearchSite: function(oEvent){
			var sValue = oEvent.getParameter("newValue"),
			aFilters = [
				new Filter("name", FilterOperator.Contains, sValue),
				new Filter("location", FilterOperator.Contains, sValue),
				new Filter("description", FilterOperator.Contains, sValue)
			],
			oFilter = new Filter({
					filters: aFilters,
					and: false
				});
			this.byId("idSitesTable").getBinding("items").filter([oFilter]);
		},

		onCancelSite: function () {
			this._getSiteDialog().close();
		},

		_getSiteDialogId: function () {
			return this.createId("siteDialog");
		},

		_getSiteDialog: function () {
			var oView = this.getView();
			if (!this._oSiteDialog) {
				this._oSiteDialog = sap.ui.xmlfragment(this._getSiteDialogId(), "com.raahassociates.launchpad.fragment.SiteDialog", this);
			}
			oView.addDependent(this._oSiteDialog);
			jQuery.sap.syncStyleClass(this.getOwnerComponent().getContentDensityClass(), oView, this._oSiteDialog);
			return this._oSiteDialog;
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