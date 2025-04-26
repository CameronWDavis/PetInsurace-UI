import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {worker} from './mocks/browser';
import {store} from "./store";
import {Provider} from "react-redux";


worker.start().then(() => {
    createRoot(document.getElementById('root')!).render(
        <Provider store={store}>
            <StrictMode>
                <App/>
            </StrictMode>
        </Provider>,
    )
});
