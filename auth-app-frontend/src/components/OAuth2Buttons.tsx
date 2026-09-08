import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

function OAuth2Buttons() {
  return (
    <div className="space-y-3">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.8,
          duration: 0.5,
        }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        <a href="/oauth2/authorization/google">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full cursor-pointer transition-all duration-300 hover:bg-muted/70"
          >
            <FcGoogle className="size-4" />
            Continue with Google
          </Button>
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.9,
          duration: 0.5,
        }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        <a href="/oauth2/authorization/github">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full cursor-pointer transition-all duration-300 hover:bg-muted/70"
          >
            <FaGithub className="size-4" />
            Continue with GitHub
          </Button>
        </a>
      </motion.div>
    </div>
  );
}

export default OAuth2Buttons;
