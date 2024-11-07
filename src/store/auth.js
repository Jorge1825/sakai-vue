import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
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
                dataToken.value = jwt_decode(token.value);
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


        const setCompany = (data) => {
            selectedCompany.value = data;
        };

        return {
            loadToken,
            decodeToken,
            getUserToken,
            getIdToken,
            getRoleToken,
            setCompany,
        };
    },
    {
        persist: true
    }
);
