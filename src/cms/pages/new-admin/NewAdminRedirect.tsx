import { useEffect } from 'react';

import { ADMIN_BASE_PATH } from '../../../admin/adminConfig';

export default function NewAdminRedirect() {
  useEffect(() => {
    window.location.replace(ADMIN_BASE_PATH);
  }, []);

  return (
    <main>
      <h1>Opening the new admin...</h1>
      <p>
        If you are not redirected, <a href={ADMIN_BASE_PATH}>open the new admin</a>.
      </p>
    </main>
  );
}
