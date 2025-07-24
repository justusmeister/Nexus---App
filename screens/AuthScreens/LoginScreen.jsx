import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Pressable,
  ActivityIndicator,
} from "react-native";
import * as Icon from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../../firebaseConfig";
import { useRoute } from "@react-navigation/native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  route = useRoute();
  const { params } = route;

  const validate = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Bitte E-Mail eingeben";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Ungültige E-Mail-Adresse";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Bitte Passwort eingeben";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    
    setLoading(true);
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      navigation.navigate("Tabs");
    } catch (error) {
      Alert.alert("Fehler", "Falsche Anmeldedaten oder Nutzer existiert nicht");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
  style={styles.container}
  enableOnAndroid
  keyboardShouldPersistTaps="handled"
  showsVerticalScrollIndicator={false}
>
      
    <View style={styles.topSection}>
  <Pressable
    onPress={() => navigation.goBack()}
    style={({ pressed }) => [
      styles.backButton,
      { opacity: pressed ? 0.6 : 1 },
    ]}
    hitSlop={12}
  >
    <Icon.Feather name="arrow-left" size={22} color="black" />
  </Pressable>

  <View style={styles.header}>
    <Text style={styles.title}>Willkommen zurück 👋</Text>
    <Text style={styles.subtitle}>Melde dich mit deinem Konto an</Text>
  </View>
</View>


      <View style={styles.inputContainer}>
        <Text style={styles.label}>E-Mail</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="deine@email.de"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Passwort</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="••••••••"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <Pressable 
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={10}
          >
            <Icon.Feather 
              name={showPassword ? "eye-off" : "eye"} 
              size={20} 
              color="#888" 
            />
          </Pressable>
        </View>
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
      </View>

      <Pressable 
        style={({ pressed }) => [styles.forgotPassword, { opacity: pressed ? 0.6 : 1 }]}
        onPress={() => navigation.navigate("ForgotPasswordScreen")}
        hitSlop={10}
      >
        <Text style={styles.forgotPasswordText}>Passwort vergessen?</Text>
      </Pressable>

      <TouchableOpacity 
        style={styles.primaryButton}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Anmelden</Text>
        )}
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>oder</Text>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity style={styles.googleButton}>
        <Icon.FontAwesome name="google" size={20} color="#DB4437" />
        <Text style={styles.googleButtonText}>Mit Google anmelden</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Noch kein Konto?</Text>
        <TouchableOpacity onPress={() => {
            if (params?.window == 1)
              navigation.goBack();
            else
              navigation.navigate("RegistrationScreen", { window: 1 })
          }}>
          <Text style={styles.footerLink}>Registrieren</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#444",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: "#000",
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 4,
  },
  passwordContainer: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 14,
    top: 14,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#007AFF",
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#eee",
  },
  dividerText: {
    paddingHorizontal: 10,
    color: "#888",
    fontSize: 12,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 24,
  },
  googleButtonText: {
    color: "#444",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 60,
  },
  footerText: {
    color: "#666",
    fontSize: 14,
  },
  footerLink: {
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 4,
  },
  topSection: {
    marginTop: 60,
    marginBottom: 32,
  },
  backButton: {
    alignSelf: "flex-start",
padding: 6,
borderRadius: 15,
backgroundColor: "rgba(0, 122, 255, 0.08)",  
borderWidth: 1,
borderColor: "#c6c6c6",                    
justifyContent: "center",
alignItems: "center",
shadowColor: "darkgray",                   
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.25,
shadowRadius: 4.65,
elevation: 8,
  },
  header: {
    marginTop: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#000",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
  },
});

export default LoginScreen;