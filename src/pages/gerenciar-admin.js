import { getApi } from "../services/api";
import { withSSRAuth } from "../utils/withSSRAuth"


export default function GerenciarAdmin() {
  return (
    <>
      <h1>Recurso de gerenciamento de administrador</h1>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = getApi(ctx);
  const response = await apiClient.get('/profile');

  return {
    props: {}
  }
}, {
  permissions: ['users.list'],
  roles: ['administrator'],
}) 