sap.ui.define([
	"com/raahassociates/launchpad/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("com.raahassociates.launchpad.controller.App", {

		onInit: function () {
			var oViewModel;
			oViewModel = new JSONModel({
				busy: false,
				delay: 0
			});
			this.setModel(oViewModel, "appView");

			// apply content density mode to root view
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},
		
		onBeforeRendering : function(){
			var oModel = new JSONModel();
			this.getBusyDialog().open();
			oModel.loadData("/api/dropdown/read", null, false,
				"GET", false, false, {
					"Accept": "*/*",
					"Content-Type": "application/json; charset=UTF-8"
			});
			this.getBusyDialog().close();
			this.getModel("dropdown").setData(oModel.getData());
		}
	});
});