import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginView } from './views/LoginView';
import { LinksView } from "./views/LinksView";
import { Logout } from "./components/Logout";
import { AuthProvider } from "./providers/AuthProvider";
import { LinksProvider } from "./providers/LinksProvider";
const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
              name="Login View"
              component={LoginView}
              options={{ title: "Read it Later - Maybe" }}
          />
          <Stack.Screen name="Links">
            {() =>
              <LinksProvider>
                <LinksView />
              </LinksProvider>}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}