function inviaRichiesta(url, method, parameters={}) {
	let contentType;
	if(method.toLowerCase() == "get"){
		contentType= "application/x-www-form-urlencoded; charset=UTF-8"
	}
	else{
		contentType= "application/json; charset=utf-8"
		parameters = JSON.stringify(parameters);
	}
		
    return $.ajax({
        url: url, //default: currentPage
        type: method,
        data: parameters,
        contentType: contentType,
        dataType: "json",
        timeout: 5000,
    });
}



function error(jqXHR, testStatus, strError) {
    if (jqXHR.status == 0)
        alert("server timeout");
    else if (jqXHR.status == 200)
        alert("Formato dei dati non corretto : " + jqXHR.responseText);
    else
        alert("Server Error: " + jqXHR.status + " - " + jqXHR.responseText);
}