import https from "node:https"
import fs from "node:fs"
import axios from "axios"
import { env } from "./env"

interface AuthenticateResponse {
  expires_in: number
  scope: string
  token_type: string
  access_token: string
  jwt_token: string
}

class IntegraContador {
  private credentials = Buffer.from(
    `${env.CONSUMER_KEY}:${env.CONSUMER_SECRET}`
  ).toString("base64")

  private httpsAgent = new https.Agent({
    pfx: fs.readFileSync(env.CERT_PATH),
    passphrase: env.CERT_PASS,
  })

  private config = {
    authenticate_url: "https://autenticacao.sapi.serpro.gov.br/authenticate",
    expires_in: 0,
    scope: "",
    token_type: "",
    access_token: "",
    jwt_token: "",
  }

  async authenticate() {
    const response = await axios.post<AuthenticateResponse>(
      this.config.authenticate_url,
      { "grant-type": "client_credentials" },
      {
        headers: {
          Authorization: `Basic ${this.credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
          "Role-Type": "TERCEIROS",
        },
        httpsAgent: this.httpsAgent,
      }
    )

    const { expires_in, access_token, jwt_token, token_type, scope } =
      response.data

    this.config.expires_in = expires_in
    this.config.scope = scope
    this.config.token_type = token_type
    this.config.access_token = access_token
    this.config.jwt_token = jwt_token
  }
}

export const integraContador = new IntegraContador()
