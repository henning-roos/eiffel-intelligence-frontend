var frontendServiceUrl = $('#frontendServiceUrl').text();

function doIfUserLoggedIn(user) {
    localStorage.removeItem("currentUser");
    localStorage.setItem("currentUser", user);
    $("#ldapUserName").show();
    $("#ldapUserName").text(user);
    $("#loginBlock").hide();
    $("#logoutBlock").show();
    $(".show_if_authorized").show();
}

function doIfUserLoggedOut() {
    localStorage.removeItem("currentUser");
    $("#ldapUserName").show();
    $("#ldapUserName").text("Guest");
    $("#loginBlock").show();
    $("#logoutBlock").hide();
    $(".show_if_authorized").hide();
    localStorage.setItem('errorsStore', []);
}

function doIfSecurityOff() {
    $("#ldapUserName").text("");
    $("#loginBlock").hide();
    $("#logoutBlock").hide();
}

function checkBackendSecured() {
    $.ajax({
        url: frontendServiceUrl + "/auth",
        type: "GET",
        contentType: "application/string; charset=utf-8",
        error: function (data) {
            doIfSecurityOff();
        },
        success: function (data) {
            var isSecured = JSON.parse(ko.toJSON(data)).security;
            if (isSecured == true) {
                checkLoggedInUser();
            } else {
                doIfSecurityOff();
            }
        }
    });
}

function checkLoggedInUser() {
    $.ajax({
        url : frontendServiceUrl + "/auth/login",
        type : "GET",
        contentType : 'application/string; charset=utf-8',
        cache: false,
        error : function (request, textStatus, errorThrown) {
            doIfUserLoggedOut();
        },
        success : function (responseData, textStatus) {
            var user = JSON.parse(ko.toJSON(responseData)).user;
            doIfUserLoggedIn(user);
        }
    });
}