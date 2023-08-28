function tm_notify(generalNotification: string, message: string) {
    $tw.wiki.addTiddler({ title: `$:/state/notification/${generalNotification}`, text: `${generalNotification}: ${message}` });
    $tw.notifier.display(`$:/state/notification/${generalNotification}`);
}

export { tm_notify };