import React from 'react';
import './Infobox.css';
import { Card, CardContent, Typography} from '@material-ui/core';

function InfoBox({title, cases, isRed,isOrange, active, total, ...props }) {
    return (
        <Card onClick= {props.onClick} className={`infoBox ${active && 'infoBox--selected'} ${isRed && "infoBoxRed"} ${isOrange && "infoBoxOrange"}`}>
            <CardContent>
                <Typography className="infoBoxTitle" color="textSecondary"> {title}</Typography>
                <h2 className="infoBoxCases"> {cases} </h2>
                <Typography className="infoBoxTotal" color="textSecondary"> {total} Total</Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
