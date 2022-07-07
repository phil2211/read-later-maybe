import React, { useState, useEffect } from "react";
import { Text, TextInput, Button, Linking } from "react-native";
import { useLinks } from "../providers/LinksProvider";
import { useNavigation } from "@react-navigation/native";
import { Logout } from "../components/Logout";
import { ListItem } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import styles from "../stylesheet";

export function LinksView() {
    const navigation = useNavigation();
    const [expanded, setExpanded] = useState(false);

    const [linkDescription, setLinkDescription] = useState("");
    const [linkURL, setLinkURL] = useState("");

    const { links, createLink, deleteLink, closeRealm } = useLinks();
    
    const onClickLink = (link) => {
        Linking.openURL(link.url).catch(err => console.error("An error occured", err));
    }

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: "Log out",
            headerLeft: () => <Logout closeRealm={closeRealm} />
        });
    }, [navigation]); 
    
    useEffect(() => {
        console.log(links);
    })
    

    return (
        <ScrollView>
            <ListItem.Accordion
                content={
                    <ListItem.Content>
                        <ListItem.Title>Create new Link</ListItem.Title>
                    </ListItem.Content>
                }
                isExpanded={expanded}
                onPress={() => {
                    setExpanded(!expanded)
                }}
            >
                {
                <>
                <TextInput
                    style={styles.inputStyle}
                    onChangeText={setLinkDescription}
                    placeholder="Description"
                    value={linkDescription}
                />
                <TextInput
                    style={styles.inputStyle}
                    onChangeText={setLinkURL}
                    placeholder="URL"
                    value={linkURL}
                />
                <Button
                    title="Add Link"
                    color="red"
                    onPress={() => createLink(linkDescription, linkURL)}
                />
                </>
                }
            </ListItem.Accordion>

            {links.map((link, index) => 
                <ListItem.Swipeable
                    onPress={() => onClickLink(link)}
                    bottomDivider
                    key={index}
                    rightContent={
                        <Button
                            title="Delete"
                            onPress={() => deleteLink(link)}
                        />
                    }
                >
                    <ListItem.Content>
                        <ListItem.Title>
                            {link.name}
                        </ListItem.Title>
                        <ListItem.Subtitle>
                            {link.url}
                        </ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem.Swipeable>
            )}
        </ScrollView>
    );
}