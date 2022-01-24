import {useState} from "react";
import CreditCardForm from "./components/CreditCardForm";

function App() {

  let [notification, setNotification] = useState({
    display: false,
    success: true,
    msg: ''
  });

  let notificationClassName = `w-75 mx-auto notification text-center m-3 alert alert-dismissible fade show ${notification.success ? "alert-success": "alert-danger"}`;

  return (
    <div id="app" className="container mt-2">
      {
        notification.display ? <div id="notification" className={notificationClassName}></div> : <div className="notification"></div>
      }
      <CreditCardForm setNotification={setNotification}/>
    </div>
  );
}

export default App;
