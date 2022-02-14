import {useState, useEffect} from 'react';

const useFetch = (url) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const abortController = new AbortController();

    const fetchData = async () => {
        const response = await fetch(url, {signal: abortController.signal});

        if(!response.ok){
            const msg = `Failed to fetch data: ${response.status}`;
            throw new Error(msg);
        }

        const result = await response.json();
        setData(result);
        setIsLoading(false);
        setError(null);
    };

    useEffect(() => { 
        setTimeout(() => {
            fetchData()
            .catch(err => {
                if(err.name === "AbortError"){
                    return;
                }
                setData([]);
                setError(err.message);
                setIsLoading(false);
            });
        }, 1000);

        return () => abortController.abort();
    }, [url]);

    return {data, isLoading, error};
};

export default useFetch;