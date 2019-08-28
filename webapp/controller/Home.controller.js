sap.ui.define([
	"com/raahassociates/launchpad/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("com.raahassociates.launchpad.controller.Home", {
		onInit: function () {

		},
		
		onNavToExpenses: function(){
			this.getRouter().navTo("Expenses");
		},
		
		onNavToExpenseBreakup: function(){
			this.getRouter().navTo("ExpenseBreakup");
		},
		
		onNavToExpenseReport: function(){
			this.getRouter().navTo("ExpenseReport");
		},
		
		onNavToReceipts: function(){
			this.getRouter().navTo("Receipts");
		},
		
		onNavToExpenseApproval: function(){
			this.getRouter().navTo("ExpenseApproval");
		},
		
		onNavToUserManagement: function(){
			this.getRouter().navTo("UserManagement");
		},
		
		onNavToSiteManagement: function(){
			this.getRouter().navTo("SiteManagement");
		},
		
		onNavToSupplierManagement: function(){
			this.getRouter().navTo("SupplierManagement");
		},
		
		onNavToPurchaseBills: function(){
			this.getRouter().navTo("PurchaseBills");
		}
	});
});