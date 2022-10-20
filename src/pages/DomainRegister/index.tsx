import React from 'react';
import { useParams } from 'react-router-dom';
import { useDomainStatus, useRefreshDomainStatus, DomainStatus } from '@service/domain/status';

const DomainRegister: React.FC = () => {
    const { domain } = useParams() ?? {};
    const status = useDomainStatus(domain!);
    console.log(status);
    return (
        <div>DomainRegister</div>
    );
}

export default DomainRegister;