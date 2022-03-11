// 20 gares [ville,km]
const graph = { 
	"Paris": { "Lyon": 100, "Marseille" : 180, "Grenoble" : 180},
	"Lyon": { "Lille": 150},
	"Marseille": {"Lyon": 130, "Grenoble" : 180},
	"Cannes" : { "Rouen": 150},
	"Lille" : { "Metz": 150 },
	"Strasbourg" : { "Metz": 150, "Amiens": 150},
	"Bordeaux" : { },
	"Nantes" : {"Nice" : 180,},
	"Rennes" : { "Angers": 150, "Toulon": 150},
    "Toulouse" : { "Nice": 150 },
	"Nice" : {"Bordeaux" : 180},
	"Grenoble" : { "Bordeaux" : 180, "Nantes" : 180},
	"Metz" : { "Dijon": 150, "Cannes": 150},
	"Rouen" : {},
	"Montpellier" : {"Toulouse": 150, "Bordeaux": 150},
	"Dijon" : { "Strasbourg": 150, "Amiens": 150},
	"Nanterre" : {"Rouen": 150},
	"Angers" : {  "Toulon": 150 },
	"Amiens" : { "Angers": 150},
	"Toulon" : {}
};


// fonction qui crée le graphe
function createGraph(graph){
	var G = new jsnx.DiGraph();
	for (const [key, value] of Object.entries(graph)){
		$('#depart').append($("<option></option>").attr("value", key).text(key));
		$('#arrivee').append($("<option></option>").attr("value", key).text(key));
		G.addNode([key]);
	}
	for (const [key, value] of Object.entries(graph)){
		for(const [cle, valeur] of Object.entries(value)){
			G.addEdgesFrom([[key, cle]]);
			G.addCycle([cle]);
		}
	}

	// stylisation du graphe 
	jsnx.draw(G, {
		element: '#canvas', 
		withLabels: true,
		weighted: true,
		labelStyle : 'Helvetica',
		layoutAttr: {
			charge: -220,
			linkDistance: 120
		},
		nodeStyle: {
			fill: '#FF3380',
			stroke: '#ffb8b8',
		},
		nodeAttr: {
			r: 22,

		},
		labelStyle: {
			fill: 'white',
			

		},
		edgeStyle: {
			fill: '#bd080a',
			'stroke-width': 5

		},
		stickyDrag: true,
		});
}

let petiteDitance = (distances, visited) => {
	let shortest = null;

	for (let node in distances) {
		let currentIsShortest =
			shortest === null || distances[node] < distances[shortest];
			//console.log(distances[node], currentIsShortest);
		if (currentIsShortest && !visited.includes(node)) {
			shortest = node;
		}
	}
	return shortest;
};


/*************************************************** DEBUT DJISKTRA *******************************************************/

const djisktra = (graph, debut, fin) => {
	//établir un objet pour enregistrer les distances à partir du noeud de départ
	let distances = {};
	distances[fin] = "Infinie";
	distances = Object.assign(distances, graph[debut]);

	let parents = { fin: null };
	for (let child in graph[debut]) {
		parents[child] = debut;
	}

	//suivre les noeuds qui ont déjà été visités
	let visited = [];

	//trouver le noeud le plus proche
	let node = petiteDitance(distances, visited);

	while (node) {
		//trouver sa distance par rapport au noeud de départ et à ses noeud enfants
		let distance = distances[node];
		let children = graph[node];
		for (let child in children) {
			if (String(child) === String(debut)) {
				continue;
			} else {
				//enregistrer la distance entre le noeud de départ et le noeud enfant 
				let newdistance = distance + children[child];
				if (!distances[child] || distances[child] > newdistance) {
					distances[child] = newdistance;
					parents[child] = node;
				}
			}
		}
		visited.push(node);

		node = petiteDitance(distances, visited);
	}

	//enregistrer le chemin le plus court
	let shortestPath = [fin];
	let parent = parents[fin];
	while (parent) {
		shortestPath.push(parent);
		parent = parents[parent];
	}
	shortestPath.reverse();

	//renvoie le chemin le plus court du noeud de départ au noeud d'arrivée et sa distance.
	let results = {
		distance: distances[fin],
		path: shortestPath,
	};


	setTableValues("temps "+ getTemps(results.distance), "distance parcourus : " + (results.distance) + "km", "temps : "+ getTemps(results.distance), "distance parcourus : "+ (results.distance)+ "km");

	return results;
	
};

/*************************************************** FIN DJISKTRA ********************************************************/
/*************************************************** DEBUT PARCOURS EN PROFONDEUR ****************************************/
class Graph
{
	constructor(v)
	{
		this.V = v;
		this.adj = new Array(v);
		for(let i = 0; i < v; i++)
			this.adj[i] = [];
	}
	
	//Fonction permettant d'ajouter une arête dans le graphe
	addEdge(v, w)
	{
		this.adj[v].push(w);
	}
	
	DFSUtil(v, visited)
	{

		//Marquer le noeud actuel comme visité et l'imprimer
		visited[v] = true;
		console.log(v + " ");

		//Récursive pour tous les sommets adjacents à ce sommet
		for(let i of this.adj[v].values())
		{
			let n = i
			if (!visited[n])
				this.DFSUtil(n, visited);
		}
	}
	
	DFS(v)
	{
		//Marquer tous les sommets comme non visités 
		let visited = new Array(this.V);
		for(let i = 0; i < this.V; i++)
			visited[i] = false;
		this.DFSUtil(v, visited);
	}
}
/************************************************* FIN PARCOURS EN PROFONDEUR ********************************************/

// distance & temps
function setTableValues( km, kilom, temps, time){
	document.getElementById("km").innerHTML = km;
	document.getElementById("kilom").innerHTML = kilom;
	document.getElementById("temps").innerHTML = temps;
	document.getElementById("time").innerHTML = time;
}

// temps = distance / vitesse
function getTemps(distance)
{
	return (((distance / 100) * 60) / 100 + addZero(d.getHours(time))) + "h" ;
}

function addZero(i) {
	if (i < 10) {i = "0" + i}
	return i;
  }

const d = new Date();
let h = addZero(d.getHours());
let m = addZero(d.getMinutes());
let s = addZero(d.getSeconds());
let time = h + ":" + m + ":" + s;

// bouton recherche
function rechercher(){
	const depart = document.getElementById('depart').value;
	const arrivee = document.getElementById('arrivee').value;
	const maDateDebut = new Date();
	const nTDebut = maDateDebut.getTime();
	console.log(shortestPath = djisktra(graph, depart, arrivee));
	//console.log(shortestPath = parcoursProfondeur(graph, depart, dejaVu));
	const maDateFin = new Date();
	const nFin = maDateFin.getTime();
	console.log(nFin - nTDebut);
}


// Lance le graph
$(document).ready(function() {
    createGraph(graph);
	const maDateDebut = new Date();
	const nTDebut = maDateDebut.getTime();
    console.log(shortestPath = djisktra(graph, 'Paris', 'Marseille'));
	const maDateFin = new Date();
	const nFin = maDateFin.getTime();
	console.log(nFin - nTDebut);

});
