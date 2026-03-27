import Navbar_ from "./Molecules/Navbar_";
import UploadFile from "./Pages/UploadFile";

export default function Home() {
  return (
    <div className="app-shell">
      <Navbar_ />
      <main className="app-container">
        <UploadFile />
      </main>
    </div>
  );
}