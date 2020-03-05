// CPCS 324 Algorithms & Data Structures 2
// Graph data structure starter - Reorganized Code
// 2019, Dr. Muhammad Al-Hashimi

// -----------------------------------------------------------------------
// simple graph object with linked-list edge implementation and minimal fields
// extra vertex and edge member fields and methods to be added later as needed

// note carefully close-to-final source file organization

var _v = [], _e = [];   // globals used by standard graph reader method


// -----------------------------------------------------------------------
// global caller function, a main() for the caller page
// only function allowed to access global vars

function _main()
{
    // create a graph (default undirected)
    // note g no longer a global var
    var g = new Graph();

    // set graph properties - set a suitable label

    g.read_graph(_v, _e);

    g.label = "Figure 3.10 (Levitin, 3rd edition)}";

    g.print_graph();

    g.DFS();

    document.write("<p>", g.dfs_push, "</p>");

    g.BFS();

    document.write("<p>", g.bfs_out, "</p>");



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

    this.adjacentById = adjacentById;


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
   this.dfs_pop = []; // DFS pop order output array
   this.bfs_out = [];             // BFS order output

   // --------------------
   // student property fields next

   this.label = "";               // (fill) identification string to label graph


   // --------------------
   // member methods use functions defined below

   this.read_graph = better_input;  // default input reader method
   this.list_vert = list_vert;
   this.print_graph = better_output; // (replace) better printer function
   this.add_edge = add_edge;

   this.DFS = DFS;                  // perform a depth-first search
   this.dfs = dfs;                  // DFS a connected component
   this.BFS = BFS;                  // perform a breadth-first search
   this.bfs = bfs;                  // BFS a connected component


   // --------------------
   // student methods next; implementing functions in student code section at end


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
   var i, v;
    for (i = 0; i < this.nv; i++)
    {
        v = this.vert[i];
        document.write("VERTEX: ", i, " {", v.label, "} - VISIT: ", v.visit,
            " - ADJACENCY: ", v.adjacentById(), "<br>");
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

    // input vertex pairs from edge list input array
    // remember to pass vertex ids to add_edge()
    for (var i = 0; i < this.ne; i++)
    {
        this.add_edge(e[i].u, e[i].v);
    }

    // double edge count if graph undirected
    if (!this.digraph)
    {
        this.ne = e.length * 2;
    }
}

// --------------------
function add_edge(u_i,v_i)
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
function DFS()
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
            this.dfs(i);
        }
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
function BFS()
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
            this.bfs(i);
        }
    }
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

function better_output()    // new default graph output method
{
document.write("<p>GRAPH {", this.label, "} ", this.digraph ? "" : "UN", "DIRECTED - ", this.nv, " VERTICES, ",
        this.ne, " EDGES:</p>");

    // list vertices
    this.list_vert();
}

// --------------------
function adjacentById()  // initally just a wrapper for .traverse
{
return this.adjacent.traverse();
}

