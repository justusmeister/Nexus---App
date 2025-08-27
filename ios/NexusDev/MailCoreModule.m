#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(MailCoreModule, NSObject)

RCT_EXTERN_METHOD(connect:(NSString *)email
                  password:(NSString *)password
                  host:(NSString *)host
                  port:(nonnull NSNumber *)port
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(fetchLatest:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(markAsRead:(nonnull NSNumber *)uid
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(markAsUnread:(nonnull NSNumber *)uid
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(fetchMailDetail:(nonnull NSNumber *)uid
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

@end
