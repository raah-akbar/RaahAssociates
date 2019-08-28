sap.ui.define([
	"com/raahassociates/launchpad/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("com.raahassociates.launchpad.controller.ExpenseReport", {
		onInit: function () {
			var oViewModel;
			// Model used to manipulate control states
			oViewModel = new JSONModel({
				NoOfProjects: "0"
			});
			this.setModel(oViewModel, "viewData");
		},
		
		onProjectUpdateFinished: function (oEvent) {
			// update the project's object counter after the table update
			var oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				this.getModel("viewData").setProperty("/NoOfProjects", iTotalItems);
			} else {
				this.getModel("viewData").setProperty("/NoOfProjects", "0");
			}
		}
	});
});