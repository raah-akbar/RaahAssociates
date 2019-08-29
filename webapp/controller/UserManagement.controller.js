sap.ui.define([
	"com/raahassociates/launchpad/controller/BaseController",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox"
], function (BaseController, MessageToast, JSONModel, Filter, FilterOperator, MessageBox) {
	"use strict";

	return BaseController.extend("com.raahassociates.launchpad.controller.UserManagement", {
		onInit: function () {
			var oViewModel;
			// Model used to manipulate control states
			oViewModel = new JSONModel({
				NoOfUsers: "0",
				UserAction: "Display",
				DeleteVisible: true,
				EditVisible: true,
				SubmitVisible: false,
				UserFormEditable: false,
				Users: [],
				UserItem: {
					username: "",
					password: "",
					firstname: "",
					lastname: "",
					email: "",
					orgemail: "",
					phone: "",
					roleid: "",
					rolename: "",
					active: "1",
					active1: true
				}
			});
			this.setModel(oViewModel, "viewData");
			this.getRouter().getRoute("UserManagement").attachMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function () {
			this._getUsers();
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

		onUserUpdateFinished: function (oEvent) {
			// update the project's object counter after the table update
			var oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				this.getModel("viewData").setProperty("/NoOfUsers", iTotalItems);
			} else {
				this.getModel("viewData").setProperty("/NoOfUsers", "0");
			}
		},

		onDisplayUser: function (oEvent) {
			var oUser = oEvent.getSource().getBindingContext("viewData").getObject(),
				oViewModel = this.getModel("viewData");
			oUser.active1 = oUser.active === "1" ? true : false;
			oViewModel.setProperty("/UserItem", jQuery.extend(true, {}, oUser));
			oViewModel.setProperty("/UserAction", "Display");
			oViewModel.setProperty("/UserFormEditable", false);
			oViewModel.setProperty("/DeleteVisible", true);
			oViewModel.setProperty("/EditVisible", true);
			oViewModel.setProperty("/SubmitVisible", false);
			this._getUserDialog().open();
		},

		onAddUser: function () {
			var oUserItem = {
					username: "",
					password: "",
					firstname: "",
					lastname: "",
					email: "",
					orgemail: "",
					phone: "",
					roleid: "",
					rolename: "",
					active: "1",
					active1: true
				},
				oViewModel = this.getModel("viewData");
			oViewModel.setProperty("/UserItem", oUserItem);
			oViewModel.setProperty("/UserAction", "Add");
			oViewModel.setProperty("/UserFormEditable", true);
			oViewModel.setProperty("/DeleteVisible", false);
			oViewModel.setProperty("/EditVisible", false);
			oViewModel.setProperty("/SubmitVisible", true);
			this._getUserDialog().open();
		},

		onEditUser: function () {
			var oViewModel = this.getModel("viewData");
			oViewModel.setProperty("/UserAction", "Edit");
			oViewModel.setProperty("/UserFormEditable", true);
			oViewModel.setProperty("/DeleteVisible", false);
			oViewModel.setProperty("/EditVisible", false);
			oViewModel.setProperty("/SubmitVisible", true);
			this._getUserDialog().open();
		},

		onDeleteUser: function () {
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.confirm("Are you sure you want to delete user ?", {
				styleClass: bCompact ? "sapUiSizeCompact" : "",
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.OK) {
						var oViewModel = this.getModel("viewData"),
							oModel = new JSONModel(),
							oPayloadObj = {};
						oPayloadObj.id = oViewModel.getProperty("/UserItem/id");
						oModel.attachRequestCompleted(this._onDeleteUserComplete, this);
						oModel.attachRequestFailed(this._onDeleteUserFailed, this);
						this.getBusyDialog().open();
						oModel.loadData("/api/user/delete", JSON.stringify(oPayloadObj), true,
							"POST", false, false, {
								"Accept": "*/*",
								"Content-Type": "application/json; charset=UTF-8"
							});
					}
				}.bind(this)
			});
		},

		_onDeleteUserComplete: function (oEvent) {
			this.getBusyDialog().close();
			var oData = oEvent.getSource().getData();
			if (oData.success) {
				MessageToast.show(oData.message);
				this._getUserDialog().close();
				this._getUsers();
			} else {
				MessageToast.show(oData.message);
			}
		},

		_onDeleteUserFailed: function () {
			this.getBusyDialog().close();
		},

		onSubmitUser: function () {
			var oViewModel = this.getModel("viewData"),
				oPayloadObj = oViewModel.getProperty("/UserItem");
			oPayloadObj.active = oPayloadObj.active1 ? "1" : "0";
			oPayloadObj.rolename = this.getValueFromKey(this.getModel("dropdown").getProperty("/records"), oPayloadObj.roleid, "textid", "text");
			if (this._isDataValid(oPayloadObj)) {
				var sUrl, oModel = new JSONModel(),
					sUserAction = oViewModel.getProperty("/UserAction");
				if (sUserAction === "Add") {
					sUrl = "/api/user/create";
				} else if (sUserAction === "Edit") {
					sUrl = "/api/user/update";
				}
				delete oPayloadObj.active1;
				oModel.attachRequestCompleted(this._onCreateUserComplete, this);
				oModel.attachRequestFailed(this._onCreateUserFailed, this);
				this.getBusyDialog().open();
				oModel.loadData(sUrl, JSON.stringify(oPayloadObj), true,
					"POST", false, false, {
						"Accept": "*/*",
						"Content-Type": "application/json; charset=UTF-8"
					});
			}
		},

		_isDataValid: function (oData) {
			var bIsValid = true,
				aFields = [];
			if (!oData.username) {
				aFields.push("Username");
			}
			if (!oData.password) {
				aFields.push("Password");
			}
			if (!oData.firstname) {
				aFields.push("First Name");
			}
			if (!oData.roleid) {
				aFields.push("Role Id");
			}
			if (!oData.rolename) {
				aFields.push("Role Name");
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

		_onCreateUserComplete: function (oEvent) {
			this.getBusyDialog().close();
			var oData = oEvent.getSource().getData();
			if (oData.success) {
				MessageToast.show(oData.message);
				this._getUserDialog().close();
				this._getUsers();
			} else {
				MessageToast.show(oData.message);
			}
		},

		_onCreateUserFailed: function () {
			this.getBusyDialog().close();
		},

		onSearchUser: function (oEvent) {
			var sValue = oEvent.getParameter("newValue"),
				aFilters = [
					new Filter("firstname", FilterOperator.Contains, sValue),
					new Filter("lastname", FilterOperator.Contains, sValue)
				],
				oFilter = new Filter({
					filters: aFilters,
					and: false
				});
			this.byId("idUsersTable").getBinding("items").filter([oFilter]);
		},

		onCancelUser: function () {
			this._getUserDialog().close();
		},

		_getUserDialogId: function () {
			return this.createId("userDialog");
		},

		_getUserDialog: function () {
			var oView = this.getView();
			if (!this._oUserDialog) {
				this._oUserDialog = sap.ui.xmlfragment(this._getUserDialogId(), "com.raahassociates.launchpad.fragment.UserDialog", this);
			}
			oView.addDependent(this._oUserDialog);
			jQuery.sap.syncStyleClass(this.getOwnerComponent().getContentDensityClass(), oView, this._oUserDialog);
			return this._oUserDialog;
		}
	});
});