import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Context } from '../index';
import { ListGroup } from 'react-bootstrap';

const TypeBar = observer(() => {
    const { device } = useContext(Context);
    return (
        <ListGroup className="shadow-sm mb-3 rounded">
            {device.types.map(type => (
                <ListGroup.Item
                    key={type.id}
                    className="cursor-pointer py-2"
                    variant={type.id === device.selectedType.id ? 'primary' : 'light'}
                    onClick={() => device.setSelectedType(type)}
                >
                    {type.name}
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
});

export default TypeBar;