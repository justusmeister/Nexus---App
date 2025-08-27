import Foundation
import MailCore
import React

@objc(MailCoreModule)
class MailCoreModule: NSObject {
  private var session: MCOIMAPSession?

  // MARK: - Connect
  @objc(connect:password:host:port:resolver:rejecter:)
  func connect(email: String,
               password: String,
               host: String,
               port: NSNumber,
               resolver: @escaping RCTPromiseResolveBlock,
               rejecter: @escaping RCTPromiseRejectBlock) {
    let s = MCOIMAPSession()
    s.hostname = host
    s.port = port.int32Value
    s.username = email
    s.password = password
    s.connectionType = .TLS

    // simple check: capability operation
    let op = s.capabilityOperation()
    op?.start { error, _ in
      if let err = error {
        rejecter("E_CONNECT", "Failed to connect: \(err.localizedDescription)", err)
      } else {
        self.session = s
        resolver(true)
      }
    }
  }

  // MARK: - Fetch latest 20 messages (headers only)
  @objc(fetchLatest:rejecter:)
  func fetchLatest(resolver: @escaping RCTPromiseResolveBlock,
                   rejecter: @escaping RCTPromiseRejectBlock) {
    guard let session = session else {
      rejecter("E_NOSESSION", "No active session", nil)
      return
    }

    let statusOp = session.folderStatusOperation("INBOX")
    statusOp?.start { error, status in
      if let err = error {
        rejecter("E_STATUS", "Failed to get status", err)
        return
      }

      let maxUID = status?.uidNext ?? 0
      let fromUID = max(maxUID > 20 ? maxUID - 19 : 1, 1)
      let range = MCOIndexSet(range: MCORangeMake(UInt64(fromUID), UInt64(maxUID)))

      let requestKind: MCOIMAPMessagesRequestKind = [.headers, .flags, .structure]
      let fetchOp = session.fetchMessagesByUIDOperation(withFolder: "INBOX",
                                                        requestKind: requestKind,
                                                        uids: range)
      fetchOp?.start { error, messages, _ in
        if let err = error {
          rejecter("E_FETCH", "Failed to fetch messages", err)
        } else {
          var result: [[String: Any]] = []
          for case let msg as MCOIMAPMessage in messages ?? [] {
            result.append([
              "uid": msg.uid,
              "subject": msg.header.subject ?? "(No subject)",
              "from": msg.header.from?.nonEncodedRFC822String() ?? "",
              "date": msg.header.date?.timeIntervalSince1970 ?? 0,
              "isRead": msg.flags.contains(.seen),
              "hasAttachments": (msg.attachments()?.count ?? 0) > 0
            ])
          }
          resolver(result)
        }
      }
    }
  }

  // MARK: - Mark as read
  @objc(markAsRead:resolver:rejecter:)
  func markAsRead(uid: UInt32,
                  resolver: @escaping RCTPromiseResolveBlock,
                  rejecter: @escaping RCTPromiseRejectBlock) {
    guard let session = session else {
      rejecter("E_NOSESSION", "No active session", nil)
      return
    }
    let op = session.storeFlagsOperation(withFolder: "INBOX",
                                         uids: MCOIndexSet(index: UInt64(uid)),
                                         kind: .add,
                                         flags: .seen)
    op?.start { error in
      if let err = error {
        rejecter("E_MARK", "Failed to mark as read", err)
      } else {
        resolver(true)
      }
    }
  }

  // MARK: - Mark as unread
  @objc(markAsUnread:resolver:rejecter:)
  func markAsUnread(uid: UInt32,
                    resolver: @escaping RCTPromiseResolveBlock,
                    rejecter: @escaping RCTPromiseRejectBlock) {
    guard let session = session else {
      rejecter("E_NOSESSION", "No active session", nil)
      return
    }
    let op = session.storeFlagsOperation(withFolder: "INBOX",
                                         uids: MCOIndexSet(index: UInt64(uid)),
                                         kind: .remove,
                                         flags: .seen)
    op?.start { error in
      if let err = error {
        rejecter("E_MARK", "Failed to mark as unread", err)
      } else {
        resolver(true)
      }
    }
  }

  // MARK: - Fetch mail body + attachments
  @objc(fetchMailDetail:resolver:rejecter:)
  func fetchMailDetail(uid: UInt32,
                       resolver: @escaping RCTPromiseResolveBlock,
                       rejecter: @escaping RCTPromiseRejectBlock) {
    guard let session = session else {
      rejecter("E_NOSESSION", "No active session", nil)
      return
    }
    let op = session.fetchMessageByUIDOperation(withFolder: "INBOX", uid: uid)
    op?.start { error, data in
      if let err = error {
        rejecter("E_BODY", "Failed to fetch message body", err)
      } else if let rawData = data {
        let parser = MCOMessageParser(data: rawData)
        let plainBody = parser.plainTextBodyRendering() ?? ""
        let htmlBody = parser.htmlRendering(with: nil) ?? ""

        var atts: [[String: Any]] = []
        for case let att as MCOAttachment in (parser.attachments() as? [MCOAttachment] ?? []) {
          atts.append([
            "filename": att.filename ?? "",
            "mimeType": att.mimeType,
            "size": att.data?.count ?? 0
          ])
        }

        resolver([
          "uid": uid,
          "subject": parser.header.subject ?? "",
          "from": parser.header.from?.nonEncodedRFC822String() ?? "",
          "date": parser.header.date?.timeIntervalSince1970 ?? 0,
          "bodyText": plainBody,
          "bodyHTML": htmlBody,
          "attachments": atts
        ])
      }
    }
  }
}
