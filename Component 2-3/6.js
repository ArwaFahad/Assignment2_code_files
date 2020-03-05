// CPCS 324 Algorithms & Data Structures 2
// Graph data structure starter - First Edge Object
// 2019, Dr. Muhammad Al-Hashimi

// -----------------------------------------------------------------------
// simple graph object with linked-list edge implementation and minimal fields
// extra vertex and edge member fields and methods to be added later as needed
//

var _v = [], _e = [];   // globals used by standard graph reader method


// -----------------------------------------------------------------------
// global caller function, a main() for the caller page
// only function allowed to access global vars

function _main()
{
   // create a graph (default undirected)
var g = new Graph();

   // set input graph properties (label, directed etc.)
 g.label = "Figure 3.10 (Levitin, 3rd edition)}";

   // use global input arrays _v and _e to initialize its internal data structures
   g.read_graph(_v,_e);

   // use print_graph() method to check graph
   g.print_graph();

   // report connectivity status if available
   document.write(g.nc == 0? '<br> no connectivity info': "DISCONNECTED: ".concat(g.nc));

   // perform depth-first search and output stored result
   g.topoSearch('DFS');

   document.write("<p>dfs_push: ", g.dfs_push, "</p>");

   // report connectivity status if available
   document.write(g.nc == 0? '<br> no connectivity info': "DISCONNECTED: ".concat(g.nc));


   // perform breadth-first search and output stored result
   g.topoSearch('BFS');

   document.write("<p>bfs_out: ", g.bfs_out, "</p>");

   // output the graph adjacency matrix
   g.makeAdjMatrix();

   document.write("<p>first row matrix: ", g.adjMatrix[0], "</p>");

   document.write("<p>last row matrix: ", g.adjMatrix[g.nv-1], "</p>");

}


// -----------------------------------------------------------------------
// Vertex object constructor

function Vertex(v)
{
   // user input fields

   this.label = v.label;          // vertex can be labelled

   // more fields to initialize internally

   this.visit = false;            // vertex can be marked visited or "seen"
   this.adjacent = new List();    // init an adjacency list

   // --------------------
   // member methods use functions defined below

        this.adjacentById = adjacentById;     // return target id of incident edges in array

}

// -----------------------------------------------------------------------
// Edge object constructor

function Edge(target_v, weight){

   this.target_v = target_v;

   this.weight = weight;
}

// -----------------------------------------------------------------------
// Graph object constructor

function Graph()
{
   this.vert = [];                // vertex list (an array of Vertex objects)
   this.nv;                       // number of vertices
   this.ne;                       // number of edges
   this.digraph = false;          // true if digraph, false otherwise (default undirected)
   this.dfs_push = [];            // DFS order output
   this.dfs_pop = [];             // DFS pop order output array
   this.bfs_out = [];             // BFS order output
   this.label = "";               // identification string to label graph

   // --------------------
   // student property fields next

        this.nc = 0;                // number of connected comps set by DFS; 0 (default) for no info
        this.adjMatrix = [];        // graph adjacency matrix to be created on demand
        this.weighted = false;


   // --------------------
   // member methods use functions defined below

   this.read_graph = better_input;   // default input reader method
   this.print_graph = better_output; // better printer function
   this.list_vert = list_vert;
   this.makeAdjMatrix = makeAdjMatrix;


   this.add_edge = add_edge;        // replace (don't change old .add_edge)
   this.add_edge2 = add_edge2;
   this.dfs = dfs;                  // DFS a connected component
   this.bfs = bfs;                  // BFS a connected component

   // --------------------
   // student methods next; implementing functions in student code section at end

   this.topoSearch = topoSearch;    // perform a topological search


}


// -------------------------------------------------------
// Functions used by methods of Graph object. Similar to
// normal functions but use object member fields and
// methods, depending on which object is passed by the
// method call through the self variable: this.
//

// --------------------
function list_vert()
{
   var i, v;  // local vars
   for (i=0; i < this.nv; i++)
   {
      v = this.vert[i];
      document.write( "VERTEX: ", i, " {", v.label, "} - VISIT: ", v.visit,
         " - ADJACENCY: ", v.adjacentById(), "<br>" );
   }
}

// --------------------
function better_input(v,e)
{
 // set vertex and edge count fields
   this.nv = v.length;
   this.ne = e.length;

   // input vertices into internal vertex array
   for (var i = 0; i < this.nv; i++)
   {
       this.vert[i] = new Vertex(v[i]);
   }

   //check if the graph is weighted or not
   this.weighted = e[0].w === undefined ? false:true;

   // input vertex pairs from edge list input array
   // remember to pass vertex ids to add_edge()
   for (var i = 0; i < this.ne; i++)
   {
      this.add_edge2(e[i].u, e[i].v, e[i].w);
   }

   // double edge count if graph undirected
   if (!this.digraph)
   {
       this.ne = e.length * 2;
   }
}

// --------------------
function better_output()
{
 document.write("<p>GRAPH {",this.label, "} ",this.weighted? "WEIGHTED, ":""
   , this.digraph?"":"UN", "DIRECTED - ", this.nv, " VERTICES, ",this.ne, " EDGES:</p>");

   
   // report connectivity status if available

   document.write(this.nc == 0? ' no connectivity info <br><br>': "DISCONNECTED: ".concat(this.nc,"<br>")); 


   // list vertices
   this.list_vert();
}

// --------------------
function add_edge(u_i,v_i)   // obsolete, replaced by add_edge2() below
{
// fetch edge vertices using their id, where u: source vertex, v: target vertex
   var u = this.vert[u_i];
   var v = this.vert[v_i];


   // insert (u,v), i.e., insert v (by id) in adjacency list of u

   u.adjacent.insert(v_i);


   // insert (v,u) if undirected graph (repeat above but reverse vertex order)

   if (!this.digraph)
   {
       v.adjacent.insert(u_i);
   }
}

// --------------------
function dfs(v_i)
{
// get landing vert by id then process
   var v = this.vert[v_i];
   v.visit = true;
   len = this.dfs_push.length;
   this.dfs_push[len] = v_i;

   // recursively traverse unvisited adjacent vertices
   var w = v.adjacentById();
   for (var j = 0; j < w.length; j++)
   {
       if (!this.vert[w[j]].visit)
       {
           this.dfs(w[j]);
       }
   }

   len_pop = this.dfs_pop.length;
   this.dfs_pop[len_pop] = v_i;
}

// --------------------
function bfs(v_i)
{
// get vertex v by its id
   var v = this.vert[v_i];

   // process v 
   v.visit = true;

   // initialize queue with v
   var q = new Queue();
   q.enqueue(v_i);


   // while queue not empty
   while (!q.isEmpty())
   {

      // dequeue and process a vertex, u
      var u_i = q.dequeue();
      var u = this.vert[u_i];
      this.bfs_out[this.bfs_out.length] = u_i; //fill the bfs_out array when dequeu the vertex


      // queue all unvisited vertices adjacent to u
      var w = u.adjacentById();
      for (var i = 0; i < w.length; i++)
      {
            if (!this.vert[w[i]].visit)
            {
               this.vert[w[i]].visit = true;
               q.enqueue(w[i]);
            }
      }
   }
}


// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
// --- begin student code section ----------------------------------------

function adjacentById()
{
var traversal = this.adjacent.traverse();

   var traversal_array = [];

   for(var i=0; i<traversal.length; i++){
      traversal_array[i] = traversal[i].target_v;      
   }

   return traversal_array;
}

// --------------------
function add_edge2(u_i,v_i,w)
{
    // fetch vertices using their id, where u: edge source vertex, v: target vertex
   var u = this.vert[u_i];
   var v = this.vert[v_i];


   // insert (u,v), i.e., insert v in adjacency list of u
   // (first create edge object using v_i as target, then pass object)
   var v_edge = new Edge(v_i);

   if(!(w === undefined)){
      
      v_edge.weight = w;
   } 
   
   u.adjacent.insert(v_edge);


   // insert (v,u) if undirected graph (repeat above but reverse vertex order)
   if(!this.digraph){

      var u_edge = new Edge(u_i);

         
      if(!(w === undefined)){
         
         u_edge.weight = w;

      } 
      
      v.adjacent.insert(u_edge);
   }


}

// --------------------
function topoSearch(type)
{
   // mark all vertices unvisited
   for (var i = 0; i < this.nv; i++)
   {
      this.vert[i].visit = false;
   }

   // traverse unvisited connected components
   for (var i = 0; i < this.nv; i++)
   {
      if (!this.vert[i].visit)
      {
         type == 'DFS'? this.dfs(i): this.bfs(i);

         this.nc++;
      }
   }


}

// --------------------
function makeAdjMatrix()
{
 // initially create row elements and zero the adjacency matrix
   for(var i=0; i<this.nv; i++){

      this.adjMatrix[i]=[];

      for(var j=0; j<this.nv;j++){
         this.adjMatrix[i][j]=0;
      }

      if(this.weighted){
         var adj = this.vert[i].adjacent.traverse();
         for(var j=0; j<adj.length ; j++){
            var edge = adj[j];
            this.adjMatrix[i][edge.target_v]=edge.weight;
         }
      }
    

      else{
         var w = this.vert[i].adjacentById();
         for(var j=0; j<w.length ; j++){
            this.adjMatrix[i][w[j]]=1;
         }
      }      
   }


}
