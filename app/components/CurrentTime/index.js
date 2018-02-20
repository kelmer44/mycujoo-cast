import React from 'react'

const CurrentTime = ({ value }) => {
    return (
        <div style={{
            position: 'absolute',
            right: '24px',
            bottom: '24px',
            zIndex: 10,
            borderRadius: '4px',
            background: 'white',
            color: '#222224',
            padding: '4px 16px',
            fontSize: '22px',
            textAlign: 'center',
        }}>
            {value}
        </div>
    )
}

export default CurrentTime
