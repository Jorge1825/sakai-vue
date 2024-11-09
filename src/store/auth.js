
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
        let companies = ref([]);
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
                // Yotas ya que el token tiene las propiedades `role` y `companies` nagregadas por washintong 
                companies.value = dataToken.value.companies || [];
            }
            return dataToken.value;
        };

        const getUserToken = () => {
            console.log(dataToken.value);
            
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
        const addCompanyId = (id) => {
            if (!companies.value.includes(id)) {
                companies.value.push(id); 
            }
        };
        const getCompanyIds = () => {
            return companies.value;
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
            hasRole,
        };
    },
    {
        persist: true
    }
);
