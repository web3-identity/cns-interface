import React from 'react';
import { useParams } from 'react-router-dom';

const DomainSetting: React.FC = () => {
    const { domain } = useParams() ?? {};

    return (
        <div>DomainSetting</div>
    );
}

export default DomainSetting;