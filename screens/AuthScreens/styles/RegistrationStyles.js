import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },
  contentContainer: {
    paddingBottom: 40,
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
  inputContainer: {
    marginBottom: 16,
  },
  passwordLabelRow: {
    flexDirection: "row",
    alignItems: "center",
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
    backgroundColor: "#fff",
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
  primaryButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  disabledButton: {
    opacity: 0.7,
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
    backgroundColor: "#fff",
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
    marginBottom: 20,
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
  requirementsContainer: {
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  requirementText: {
    color: "#666",
    fontSize: 13,
  },
});