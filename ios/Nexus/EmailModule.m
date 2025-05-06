#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(EmailModule, NSObject)

RCT_EXTERN_METHOD(getRecentEmails:(NSString *)email
                  password:(NSString *)password
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
