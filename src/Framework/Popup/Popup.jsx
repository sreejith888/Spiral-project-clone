import axios from "axios";
import { useEffect, useState } from "react";
import "./Popup.css";
function Popup(props) {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      setPosts(response.data);
      setLoading(false);
    };

    loadPosts();
  }, []);


  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button
            className="titleCloseBtn"
            onClick={() => {
              props.setModalOpen(false);
            }}
          >
            x
          </button>
        </div>
        <div className="title">
          <h1>Quick Search</h1>
          <input
        style={{ width: "70%", height: "25px" }}
        type="text"
        placeholder="Search..."
        onChange={(e) => setSearchTitle(e.target.value)}
      />
       {loading ? (
        <h4>Loading ...</h4>
      ) : (
        posts
          .filter((value) => {
            if (searchTitle === "") {
              return value;
            } else if (
              value.name.toLowerCase().includes(searchTitle.toLowerCase())
            ) {
              return value;
            }
          })
          .map((item) => <h5 key={item.id}>{item.name}</h5>)
      )}
        </div>
      </div>
    </div>
  );
}

export default Popup;
