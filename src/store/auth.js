
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const storeAuth = defineStore(
    'storeAuth',
    () => {
        // State
        let token = ref('');
        let dataToken = ref(null);
        let enterprises = ref([]);
        let selectedCompany = ref(null);

        // Functions
        const loadToken = async (credentials) => {
            try {
                token.value = Cookies.get('access_token');
                return token.value;
            } catch (error) {
                throw error;
            }
        };

        const decodeToken = () => {
            if (token.value) {
                dataToken.value = jwtDecode(token.value);
                console.log(dataToken.value);
                enterprises.value = dataToken.value.enterprises || [];
            }
            return dataToken.value;
        };

        const getUserToken = () => {
            return{
                username: dataToken.value.username,
                email: dataToken.value.email,
            }
        }

        const getIdToken = () => {
            return dataToken.value.id;
        }

        const getRoleToken = () => {
            return dataToken.value.role;
        }

        const hasRole = (requiredRole) => {
            return dataToken.value?.role === requiredRole;
        };
        const setCompany = (data) => {
            selectedCompany.value = data;
        };
        
        const getSelectedCompany = () => {
            return selectedCompany.value;
        };

        const addCompanyId = (id) => {
            if (!enterprises.value.includes(id)) {
                enterprises.value.push(id); 
            }
        };
        const getCompanyIds = () => {
            return enterprises.value;
        };

        return {
            loadToken,
            decodeToken,
            getUserToken,
            getIdToken,
            getRoleToken,
            setCompany,
            addCompanyId,
            getCompanyIds,
            getSelectedCompany,
            hasRole,
        };
    },
    {
        persist: true,
    }
);
