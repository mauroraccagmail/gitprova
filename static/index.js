"use strict";
let risposte=[];
$(document).ready(function() {

    /* *************************** AVVIO ************************ */
    let questions = inviaRichiesta('/api/elencoDomande', 'GET');
    questions.done(function(data) {
        visualizzaDomande(data);
    });
    questions.fail(function(jqXHR, test_status, str_error) {
        if (jqXHR.status == 403) { // forbidden
            window.location.href = "login.html"
        } else
            error(jqXHR, test_status, str_error)
    });

    $("#btnLogout").on("click", function() {
        //document.cookie = "token=; max-age=-1; Path=/"
        let rq = inviaRichiesta('/api/logout', 'POST');
        rq.done(function(data) {
            alert(data.ris);
			window.location.href = "login.html"
        });
        rq.fail(function(jqXHR, test_status, str_error) {
            if (jqXHR.status == 403) { // forbidden
				window.location.href = "login.html"
            } else
                error(jqXHR, test_status, str_error)
        });
    });
});

/* ********************** Visualizza Mail  ************************ */
function visualizzaDomande(data) {
    for(var i = 0;i<data.length;i++){
        let divDom=$("<div></div>");
        divDom.prop("id","dom"+(i+1));
        divDom.css("margin-bottom","30px");
        $("#elencoDomande").append(divDom);
        var h4=$("<h4></h4>")
        h4.html((i+1) + ") " + data[i].domanda);
        divDom.append(h4);
        for(var j=0;j<data[i].risposte.length;j++){
            var rad=$("<input type='radio' name='rad"+i+"' class='rad"+i+"' value='" + j + "' />");
            rad.appendTo(divDom);
            var span=$("<span></span>");
            span.html(data[i].risposte[j]);
            divDom.append(span);
            divDom.append("<br>");
        }
        var rad=$("<input type='radio' name='rad"+i+"' class='rad"+i+"' value='no' checked />");
        divDom.append(rad);
        var span=$("<span></span>");
        span.html("Non rispondo");
        divDom.append(span);
        divDom.append("<br>");
        risposte[i]=data[i].correct;
    }
    var btn=$("<button></button>");
    btn.html("Consegna");
    btn.on("click",correggi);
    btn.css({"width":"1000px", "height":"50px", "margin": "20px auto", "display": "block", "font-size":"x-large"});
    btn.prop("id","btnCorreggi");
    $("body").append(btn);
}

function correggi() {
    let voto=0;
    for(var i=0;i<risposte.length;i++){
        if($(".rad"+i+":checked").val()==risposte[i])
            voto++;
        else
            if($(".rad"+i+":checked").val()!="no"){
                $(".rad"+i+":checked").next().css("color","red");
                voto-=0.25;
            }
    }
    voto=3+voto*7/10;
    alert("Il voto è: " + voto);
    $(this).prop("disabled","true");
}