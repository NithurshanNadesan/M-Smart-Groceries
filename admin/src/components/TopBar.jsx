import "./Dashboard.css"; 
import search_icon from "../assets/search.png"
import avatar from "../assets/Account.png"; 

const TopBar = () => {
  return (
    <nav className="navbar navbar-expand px-4 py-3 w-100">
        <div className="container-fluid">
            <form className="d-flex">
                <input className="form-control me-2" type="search" placeholder="  Search..." aria-label="Search" />
                <button className="btn btn-outline-secondary" type="submit">
                  <img src={search_icon} alt="" />
                </button>
            </form>
            <div className="ms-auto d-flex align-items-center">
                <p className="mb-0 me-2">Welcome, Admin!</p>
                <img src={avatar} className="avatar img-fluid" alt="Avatar" />
            </div>
        </div>
    </nav>
  );
};

export default TopBar;