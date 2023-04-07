const useMutation = () => ({isLoading: false, data: {} });
const useQuery = () => ({isLoading: false, data: {} });

class QueryClient {
    constructor() {}
}

export { useMutation, useQuery, QueryClient };