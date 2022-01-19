import {useState} from "react";
import CreditCardForm from "./components/CreditCardForm";

function App() {

  let [notification, setNotification] = useState({
    display: false,
    success: true,
    msg: ''
  });

  let notificationClassName = "container mt-2";

  return (
    <div className="app" className="">
      {
        notification.display ? <div id="notification" className={notificationClassName}></div> : <div className="notification"></div>
      }
      <CreditCardForm />
    </div>
  );
}

export default App;
