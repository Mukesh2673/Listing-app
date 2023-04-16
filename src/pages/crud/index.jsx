import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./home.scss";
import { useContactsQuery, useDeleteContactMutation } from "../../service";
import { useEffect } from "react";

const Home1 = () => {
  const {data,error,isLoading,isSuccess,isFetching}=useContactsQuery();
  const [deleteContact]=useDeleteContactMutation();
  useEffect(()=>{
   if(error){
    toast.error("something went wrong")
   }
  },[error]);
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure that you wanted to delete that user ?")) {
      await deleteContact(id)
      toast.success("Contact Deleted Successfully");
    }
  };
  return (
    <div style={{ marginTop: "100px" }}>
      <h2>Redux Toolkit RTK Query CRUD with React and JSON Server </h2>
      <Link to="/add">
        <button className="btn btn-add">Add Contact</button>
      </Link>
      <br />
      <br />
      <table className="styled-table">
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>ID</th>
            <th style={{ textAlign: "center" }}>Name</th>
            <th style={{ textAlign: "center" }}>Email</th>
            <th style={{ textAlign: "center" }}>Contact</th>
            <th style={{ textAlign: "center" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((item, index) => {
              return (
                <tr key={item.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.contact}</td>
                  <td>
                    <Link to={`/update/${item.id}`}>
                      <button className="btn btn-edit">Edit</button>
                    </Link>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                    <Link to={`/view/${item.id}`}>
                      <button className="btn btn-view">View</button>
                    </Link>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default Home1;