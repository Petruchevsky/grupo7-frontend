import Image from "next/image";
import { Spinner } from "react-bootstrap";


function Loading() {
    return (
        <main className="loading-container">
            <h1 className="h1-loading">Loading <Spinner className="loading-spinner" variant="default" animation="grow" speed={0.5} /></h1>
            <div className="img-loading-div">
                <Image src="/img/logo-redondo.png" alt="loading" width={300} height={300} className="img-loading"/>
            </div>
        </main>
    );
}

export default Loading;