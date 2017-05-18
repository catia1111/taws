var field = "", //Variavel para guardar a area
    city = "", //Variavel para guardar cidade
    areas = [],
    page = 0,
    usersPorArea = {},
    id,
    apikey="KpLX85kkjlYFf96jzDBCSKRdtPkz9Vki",
	apikey2 = "BI6Vns2PFSdGblDFKdt99ymnKpmXfUiC",
    users_url = "https://www.behance.net/v2/users?q=&callback=jsonpCallback&",
    behanceUsers,
	behanceProjects,
    stats,
    projectID=[],
    userIDs=[],
    conseguiuEncontrar = false,
    overPopup = false; 





$(document).ready(function () { //quando o site estiver carregado
    //buscar informações onde escrevo
    $obterInputs = (function () {
        $("#searchButton").text("Procura +");
        field = $("#areaInput").val();
        city = $("#cidadeInput").val();
        //console.log("Cidade: " + cidade + "\n" + "Area: " + area);
        //chama a função para pesquisar


        $("#userData").html('');

        page += 1;
        console.log('more artists — page ' + page);

        //chama a funcao para pesquisar
        $searchUsers();

    });

    $("#searchButton").click($obterInputs);

    //pedido
    $searchUsers = (function () {

        $.ajax({
            url: users_url + "field=" + field + "&city=" + city + "&page=" + page + "&per_page=8",
            dataType: "jsonp",
            data: {
                api_key: apikey2
            },
            timeout: 1500,
            jsonp: 'callback',
            callback: "jsonpCallback",
            success: function (response) {
                console.log("recebeu "+response.users.length+" users");
                $processUsers(response);
                $getUsersPorArea(response);
            },
            error: ("erro")
        });
    });
	
    
	$searchProjects = (function (userID, i) {
        var j =i;
		console.log("procurou projecto do user"+j);
		$.ajax({
			url: "http://www.behance.net/v2/users/"+userID+"/projects?sort=appreciations",
			dataType: "jsonp",
			data: {
				api_key: apikey2
			},
			timeout: 1500,
			success: function (response) {
                console.log("encontrou projecto de "+j);
                $processProjects(response,j);
	
			},
			error: ("erro")

        });
		
		});
    
        $toggle = (function(i) { //adicionar!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        var selecionado = document.getElementById("popupFundo"+i);      
        if (selecionado.style.display == "block" && !overPopup) selecionado.style.display = "none";
        else selecionado.style.display = "block";

    });
    
  
    //tratar os dados dos utilizadores pesquisados
    $processUsers = (function (userArray) {
        $("#userData").html("");
        stats =[];
        userIDs=[];
        projectID=[];
        //variavel que guarda a div com os utilizadores
        if (userArray.users.length > 0) {
            for (var i = 0; i < userArray.users.length; i++) {
                
                console.log("a processar user "+i);
                
                stats[i]=userArray.users[i].stats.appreciations;
                console.log(" - "+stats[i] + " apritiations");
                
                userIDs[i]=userArray.users[i].id;
				
                //array para guardar as áreas de utilizador
                var userAreas = "";
                for (var j = 1; j < userArray.users[i].fields.length; j++) {
                    userAreas += ", " + userArray.users[i].fields[j];
                    
                     
                }
                //cria html para fazer a div do utilizador
                $("#userData").append("<div class='geral' onclick='$toggle(" + i + ")'> <img class='profile_pic' src=" + userArray.users[i].images[115] + "/img>" +
                    "<div id ='popupFundo" + i + "' class='popupFundo'><div onmouseover='overPopup = true' onmouseout='overPopup= false'id='popup" + i + "' class='popup'><p id='box' class='nome'>" + userArray.users[i].display_name + "</p>" + "<img class='profile_pic' src=" + userArray.users[i].images[115] + "/>" +"<br> </br>" +
                    "<a id='box' href=" + userArray.users[i].url + ">Behance</a>" +
                    "<p id='box' class='cidade'>cidade: " + userArray.users[i].city + "</p>" +
                    "<p id='box' class='visitas'>Visitas: " + userArray.users[i].stats.views + "</p>" +
                    "<p id='box' class='apreciações'>Apreciações: " + userArray.users[i].stats.appreciations + "</p>" +
                    "<p id='box' class='seguidores'>Seguidores: " + userArray.users[i].stats.followers + "</p>" +
                    "<p id='box' class='area'>Áreas: " + userArray.users[i].fields[0] + userAreas + "</p></div></div></div><br>");
            

                
            $searchProjects(userArray.users[i].id, i); //faz o searchProject e passa o ID do user e a posiçao no array dos users
           
            }
        }
    });
    
    $processProjects =(function(projects,i){
        projectID[i] = projects.projects[0].id;
        console.log(projectID[i]);
        $("#popup"+ i).append("Projecto mais Apreciado : "+ projects.projects[0].name +"<br></br>" +"<img  src="+projects.projects[0].covers[115]+"/img>" ); // append da cover na div que tem o id do user correspondente        
    });
    
    $getAreasHTML = (function () { //vai buscar as areas que estao no html
        var areastemp = document.getElementById("areaInput").getElementsByTagName("option"); //array com todas as opcoes no html incluindo a 1ª, q n tem nada
        for (var i = 1; i < areastemp.length; i++) { //corre cada opçao no html excluindo a primeira, q n tem nada (i começa em 1 em vez de 0)
            areas[i - 1] = areastemp[i].innerHTML; //cada posicao no novo array "areas" é = a cada opcaoHtml+1, excluindo a primeira (areas[0] = areastem[1]) 
        }
        console.log("as areas sao" + areas);
    });
    $getAreasHTML();
    $getUsersPorArea = (function (b) {
        //mete todas as areas que estao no html num objeto em que todas as instancias sao 0 -> animation : 0, Branding: 0, etc
        for (var i = 0; i < areas.length; i++) {
            usersPorArea[areas[i]] = "0";
        }
        //console.log(usersPorArea);
        for (var u = 0; u < b.users.length; u++) { //corre todos os users
            for (var a = 0; a < b.users[u].fields.length; a++) { //corre todoas as areas para cada user
                if (b.users[u].fields[a] in usersPorArea) { //se uma area do user estiver no array de areasHTML ele incrementa essa area
                    usersPorArea[b.users[u].fields[a]]++;
                }
            }
        }

        //console.log(usersPorArea);
        $desenharGrafo(usersPorArea);
        //desenha gráfico
    });


    $desenharGrafo = (function (usersPorArea) {

        for (var area in usersPorArea) {
            console.log(area + ", " + usersPorArea[area]);

        }

        var valores = [];
        var cores = [];
        var contornos = [];
        var cor = 0;
        for (var i = 0; i < areas.length; i++) {
            valores.push(usersPorArea[areas[i]]);

            cor = i % 6;
            switch (cor) {
            case 0:
                cores.push('rgba(255, 99, 132, 0.2)');
                contornos.push('rgba(255, 99, 132, 1)');
                break;
            case 1:
                cores.push('rgba(54, 162, 235, 0.2)');
                contornos.push('rgba(54, 162, 235, 1)');
                break;
            case 2:
                cores.push('rgba(255, 206, 86, 0.2)');
                contornos.push('rgba(255, 206, 86, 1)');
                break;
            case 3:
                cores.push('rgba(75, 192, 192, 0.2)');
                contornos.push('rgba(75, 192, 192, 1)');
                break;
            case 4:
                cores.push('rgba(153, 102, 255, 0.2)');
                contornos.push('rgba(153, 102, 255, 1)');
                break;
            case 5:
                cores.push('rgba(255, 159, 64, 0.2)');
                contornos.push('rgba(255, 159, 64, 1)');
                break;
            default:
                break;
            }

        }
        data = {
            labels: areas,

            datasets: [
                {
                    label: "Nº Pessoas Por Área",
                    backgroundColor: cores,
                    borderColor: contornos,
                    borderWidth: 1,
                    data:  valores,
                }]
        };

        var ctx = document.getElementById("canvas").getContext("2d");
        window.data = new Chart(ctx, {
            type: 'horizontalBar',
            data: data,
            options: {
                // Elements options apply to all of the options unless overridden in a dataset
                // In this case, we are setting the border of each horizontal bar to be 2px wide
                elements: {
                    rectangle: {
                        borderWidth: 2,
                    }
                },
                responsive: true,
                legend: {
                    position: 'right',
                },
                title: {
                    display: true,
                    text: 'Número de pessoas por área'
                }
            }
        });

    });


    $grafoclick = (function () {
        var x = document.getElementById('container');
          

        if (x.style.display === 'block') {
             x.style.display = 'none';
        $("#grafoBT").text("Ver Gráfico");
            
        } else {
          
            
            x.style.display = 'block';
            $("#grafoBT").text("Fechar Gráfico");

        }
        
    });

    $("#grafoBT").click($grafoclick);
    
});

