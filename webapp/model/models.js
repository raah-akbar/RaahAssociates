sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		
		createUserModel: function () {
			var oModel = new JSONModel();
			return oModel;
		},
		
		createDropdownModel: function () {
			var oModel = new JSONModel();
			return oModel;
		}
	};
});