import Foundation
import MailCore

@objc(EmailModule)
class EmailModule: NSObject {

  @objc
  func getRecentEmails(_ email: String, password: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {

    let session = MCOIMAPSession()
    session.hostname = "imap.iserv.eu"
    session.port = 993
    session.username = email
    session.password = password
    session.connectionType = .TLS

    let requestKind: MCOIMAPMessagesRequestKind = [.headers, .structure, .internalDate, .fullHeaders, .flags]
    let inboxFolder = "INBOX"
    let fetchOperation = session.fetchMessagesOperation(withFolder: inboxFolder, requestKind: requestKind, uids: MCOIndexSet(range: MCORange(location: 1, length: UInt64.max)))

    fetchOperation?.start { (error, fetchedMessages, _) in
      if let error = error {
        reject("FETCH_ERROR", error.localizedDescription, error)
        return
      }

      guard let messages = fetchedMessages as? [MCOIMAPMessage] else {
        resolve([])
        return
      }

      let latest = messages.suffix(20).reversed().map { msg in
        return [
          "subject": msg.header.subject ?? "",
          "from": msg.header.from.displayName ?? msg.header.from.mailbox ?? "",
          "date": msg.header.date.description
        ]
      }

      resolve(latest)
    }
  }
}
