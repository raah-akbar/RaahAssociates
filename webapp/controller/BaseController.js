/*global history */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/Fragment"
], function (Controller, History, DateFormat, Fragment) {
	"use strict";

	return Controller.extend("com.raahassociates.launchpad.controller.BaseController", {
		/**
		 * Convenience method for accessing the router in every controller of the application.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},

		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Convenience method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		
		/**
		 * Returns a control from fragment with provided fragment id
		 * @param   {string}              sFragId    fragment id
		 * @param   {string}              sControlId control if to get
		 * @returns {sap.ui.core.Control} Control inside fragment
		 * @private
		 */
		getFragmentControl: function (sFragId, sControlId) {
			return Fragment.byId(sFragId, sControlId);
		},
		
		/**
		 * Event handler  for navigating back.
		 * It checks if there is a history entry. If yes, history.go(-1) will happen.
		 * If not, it will replace the current entry of the browser history with the master route.
		 * @public
		 */
		onNavBack: function () {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				// The history contains a previous entry
				history.go(-1);
			} else {
				// Otherwise we go backwards with a forward history
				var bReplace = true;
				this.getRouter().navTo("Login", {}, bReplace);
			}
		},
		
		onLogout: function(){
			this.getRouter().navTo("Login");
		},
		/**
		 * method which returns the Busy dialog instance
		 * @param   {string}       sTitle optional parameter
		 * @param   {string}       sText  optional parameter
		 * @returns {sap.m.Dialog} - Busy Dialog Instance
		 */
		getBusyDialog: function (sTitle, sText) {
			if (!this._oBusyDialog) {
				// Create dialog using fragment factory
				this._oBusyDialog = sap.ui.xmlfragment(this._getBusyDialogId(),
					"com.raahassociates.launchpad.fragment.BusyDialog", this);

				// Connect dialog to view
				this.getView().addDependent(this._oBusyDialog);
			}
			if (sTitle || sTitle === null) {
				this._oBusyDialog.setTitle(sTitle);
			}
			if (sText || sTitle === null) {
				this._oBusyDialog.setText(sText);
			}
			return this._oBusyDialog;
		},

		/**
		 * method to create the Id for Busy dialog
		 * @returns {string} - ID of fragment
		 * @private
		 */
		_getBusyDialogId: function () {
			return this.createId("idBusyDialog");
		},
		
		getDataDispValue: function(sDate){
			if(sDate){
				var oInDateFormat = DateFormat.getDateInstance({pattern : "yyyy-MM-dd HH:mm:ss" }),
				oDate = oInDateFormat.parse(sDate),
				oOutDateFormat = DateFormat.getDateInstance({pattern : "MMM d, yyyy" });   
				return oOutDateFormat.format(oDate);
			}
			return sDate;
		},
		
		getValueFromKey: function(arr, key, keyValue, valueValue){
			var i, sValue = "";
			for(i = 0; i < arr.length; i++){
				if(arr[i][keyValue] === key){
					sValue = arr[i][valueValue];
					break;
				}
			}
			return sValue;
		}
	});

});