sap.ui.define([
	"com/raahassociates/launchpad/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function (BaseController, JSONModel, MessageToast) {
	"use strict";

	return BaseController.extend("com.raahassociates.launchpad.controller.Login", {
		onInit: function () {

		},
		
		onLogin: function(){
			var oModel = new JSONModel(),
			sUserName = this.byId("idUserNameInput").getValue(),
			sPassword = this.byId("idPasswordInput").getValue(),
			oPayload = {
				username : sUserName,
				password : sPassword
			};
			oModel.attachRequestCompleted(this._onLoginComplete, this);
			oModel.attachRequestFailed(this._onLoginFailed, this);
			this.getBusyDialog().open();
			oModel.loadData("/api/auth/login", JSON.stringify(oPayload), true,
					"POST", false, false, {"Accept" : "*/*",
				"Content-Type" : "application/json; charset=UTF-8"});
		},
		
		_onLoginComplete: function(oEvent){
			this.getBusyDialog().close();
			var oData = oEvent.getSource().getData();
			if(oData.success){
				this.getModel("user").setData(oData.records[0]);
				this.getRouter().navTo("Home");
			} else {
				MessageToast.show(oData.message);
			}
		},
		
		_onLoginFailed: function(){
			this.getBusyDialog().close();
		}
	});
});