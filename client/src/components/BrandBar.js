import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { Context } from './../index';
import { Button, ButtonGroup } from 'react-bootstrap';

const BrandBar = observer(() => {
    const { device } = useContext(Context);

    return (
        <ButtonGroup className="mb-3 flex-wrap">
            {device.brands.map(brand => (
                <Button
                    key={brand.id}
                    variant={brand.id === device.selectedBrand.id ? 'dark' : 'outline-dark'}
                    className="me-2 mb-2 rounded-pill px-3"
                    onClick={() => device.setSelectedBrand(brand)}
                >
                    {brand.name}
                </Button>
            ))}
        </ButtonGroup>
    );
});

export default BrandBar;
