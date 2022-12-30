import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Popup.css";
const Popup = (props) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchItem, setSearchItem] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      setData(response.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="modalMain">
      <div className="modal_container">
        <button
          className="modal_btn"
          onClick={() => {
            props.setModalOpen(false);
          }}
        >
          x
        </button>
        <div className="title">
          <h2>Quick search</h2>
          <input
            className="modal_input"
            type="text"
            placeholder="search item.."
            onChange={(e) => setSearchItem(e.target.value)}
          />
          {loading ? (
            <h4>Loading ...</h4>
          ) : (
            data
              .filter((value) => {
                if (searchItem === "") {
                  return value;
                } else if (
                  value.name.toLowerCase().includes(searchItem.toLowerCase())
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
};

export default Popup;
