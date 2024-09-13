import { useEffect, useState, } from "react"

export default function Todo() {

    const [title,setTitle] = useState("");
    const [description,setDescrition] = useState("");
    const [todos, setTodos] =useState([]); 
    const [error, setError] = useState("");
    const [message, setMessage] =useState("");
    const [editid, setEditid] =useState(-1)


    //Edit
    const [edittitle, setEditTitle] = useState("");
    const [editdescription, setEditDescrition] = useState("");
    const apiUrl = "http://localhost:8000";

    
    const handelSubmit =() => {
      setError("")
       //check Inputs
       if (title.trim() !== "" && description.trim() !== "") {
        fetch(apiUrl + "/todos", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
             },
          body: JSON.stringify({ title,description })   
      }).then((res) => {
            if (res.ok) {
          //add item Todo list
            setTodos([...todos, {title, description }]);
            setTitle("")
            setDescrition("")
            setMessage("item added successfully");
            setTimeout(() => {
              setMessage("");
            },3000)

            } else{
             //set error
             setError("Unable to create Todo item")
            }
          }).catch (() => {
            setError("Unable to create Todo item")
          }) 
        }
       
      }
            useEffect(() => {
              getItems()
            },[])

            const getItems = () => {
              fetch(apiUrl+"/todos")
              .then((res) => res.json())
              .then((res) => {
                setTodos(res)
              })
            }

            const handleEdit = (item) => {
              setEditid(item._id);
              setEditTitle(item.title); 
              setEditDescrition(item.description);
            }

            const handelUpdate = () => {
              setError("")
              //check  edit Inputs
              if (edittitle.trim() !== "" && editdescription.trim() !== "") {
               fetch(apiUrl + "/todos/"+editid, {
                   method: "PUT",
                   headers: {
                       "Content-Type" : "application/json"
                    },
                 body: JSON.stringify({ title:edittitle, description:editdescription })   
             }).then((res) => {
                   if (res.ok) {
                 //Updated item to list
                const UpdateTodos = todos.map((item) => {
                      if (item._id == editid) {
                        item.title = setEditTitle; 
                        item.description = setEditDescrition;
                      }
                      return item;
                 })
                   setTodos(UpdateTodos);
                   setEditTitle("");
                   setEditDescrition("");
                   setMessage("item updated successfully");
                   setTimeout(() => {
                     setMessage("");
                   },3000)
                    
                   setEditid(-1)


                   } else{
                    //set error
                    setError("Unable to create Todo item")
                   }
                 }).catch (() => {
                   setError("Unable to create Todo item")
                 }) 
               }
            }

            const handleEditCancel =() => {
              setEditid(-1)
            }

            const handelDelete =(id) => {
               if (window.confirm('Are sure want to delete')) {
                  fetch(apiUrl+'/todos/'+id, {
                    method: "DELETE"
                  })
                  .then(() => {
                    const UpdateTodos = todos.filter((item) => item._id !== id);
                    setTodos(UpdateTodos);
                  })
               }   
            }
    
    return <>
             <div className="row p-3 bg-success text-light">
                    <h1>Todo Project work with MERN stock</h1>
              </div>
              <div className="row">
                <h3>Add item</h3>
                {message && <p className="text-success">{message}</p>} 
                <div className="form-group d-flex gap-2">
                     <input  placeholder="Titel"  onChange={(e) =>setTitle(e.target.value)} value={title} className="form-control" type="text" />
                     <input  placeholder="Description" onChange={(e) =>setDescrition(e.target.value)} value={description} className="form-control" type="text" />
                     <button className="btn btn-dark" onClick={handelSubmit}>Submit</button>
                </div>
                {error && <p className="text-danger">{error}</p>}
              </div>
              <div className="row mt-3">
                <h3>Tasks</h3>
                <div className="col-md-6">
                <ul className="list-group">

                  {
                    todos.map((item) => <li className="list-group-item  bg-info d-flex justify-content-between align-items-center my-2">
                    <div className="d-flex flex-column me-2">
                      {
                        editid == -1 || editid !== item._id ?<>
                            <span className="fw-bold">{item.title}</span>
                            <span>{item.description}</span>   
                        </> : <>
                        <div className="form-group d-flex gap-2">
                          <input  placeholder="Titel"  onChange={(e) =>setEditTitle(e.target.value)}value={edittitle} className="form-control" type="text" />
                          <input  placeholder="Description" onChange={(e) =>setEditDescrition(e.target.value)}value={editdescription} className="form-control" type="text" />
                       </div>
                        </>
                      }
                    </div>
                    <div className="d-flex gap-2">
                    {editid == -1  ?<button className="btn btn-warning" onClick={() =>handleEdit(item)}>Edit</button> : <button className="btn btn-warning" onClick={handelUpdate}>Update</button> }
                    {editid == -1 ? <button className="btn btn-danger" onClick={() =>handelDelete(item._id)}>Delete</button> :
                      <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button> }
                    </div> 
                  </li> 
                )
                  }

                </ul>
               </div>   
              </div>
           </>
}