import {useEffect, useState} from "react";
import {Alert, Box, Checkbox, CircularProgress, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import styles from "../styles/Home.module.css";
import Head from "next/head";

type DataEntry = { payload: string }
type DataEntryProps = { data: DataEntry[] }

export default function MyAwesomePage() {
    const [data, setData] = useState<DataEntry[] | null>(null)
    const [isLoading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        setLoading(true)
        fetch('/api/random-data')
            .then(res => res.json())
            .then(data => {
                setData(data)
                setLoading(false)
            })
    }, [])

    const content = renderContent(isLoading, data)

    return <div className={styles.container}>
        <Head>
            <title>My Awesome Page</title>
            <meta name="description" content="Generated by create next app"/>
            <link rel="icon" href="/favicon.ico"/>
        </Head>

        <main className={styles.main}>
            {content}
        </main>
    </div>
}

function renderContent(isLoading: boolean, data: DataEntry[] | null): JSX.Element {
    if (isLoading) {
        return <Box sx={{display: 'flex'}}><CircularProgress/></Box>
    }

    if (!data) {
        return <Alert severity="error">Error fetching data!</Alert>
    }

    return <CheckboxList data={data}/>
}

function CheckboxList({data}: DataEntryProps) {
    const [checked, setChecked] = useState<DataEntry[]>([]);

    const handleToggle = (entry: DataEntry) => () => {
        const currentIndex = checked.indexOf(entry);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(entry);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    return (
        <List dense sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
            {data.map((entry) => {
                const labelId = `checkbox-list-secondary-label-${entry.payload}`;
                return (
                    <ListItem
                        key={entry.payload}
                        secondaryAction={
                            <Checkbox
                                edge="end"
                                onChange={handleToggle(entry)}
                                checked={checked.indexOf(entry) !== -1}
                                inputProps={{'aria-labelledby': labelId}}
                            />
                        }
                        disablePadding
                    >
                        <ListItemButton>
                            <ListItemText id={labelId} primary={`Line item ${entry.payload}`}/>
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    )
}
