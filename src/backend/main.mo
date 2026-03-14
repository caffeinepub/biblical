import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var nextStoryId = 1;
  let stories = Map.empty<Nat, Story>();
  let displayNames = Map.empty<Principal, Text>();

  public type Story = {
    id : Nat;
    authorPrincipal : Principal;
    authorName : Text;
    title : Text;
    body : Text;
    workCategory : Text;
    earningsAmount : Text;
    createdAt : Int;
    likes : Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  module Story {
    public func compareByCreatedAt(story1 : Story, story2 : Story) : Order.Order {
      Int.compare(story2.createdAt, story1.createdAt); // Newest first
    };
  };

  public shared ({ caller }) func createStory(title : Text, body : Text, workCategory : Text, earningsAmount : Text) : async Story {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create stories");
    };

    if (title.trim(#char ' ').size() == 0) {
      Runtime.trap("Title cannot be empty");
    };
    if (body.trim(#char ' ').size() == 0) {
      Runtime.trap("Body cannot be empty");
    };

    let authorName = switch (displayNames.get(caller)) {
      case (?name) { name };
      case (null) { "Anonymous" };
    };

    let story : Story = {
      id = nextStoryId;
      authorPrincipal = caller;
      authorName;
      title;
      body;
      workCategory;
      earningsAmount;
      createdAt = Time.now();
      likes = 0;
    };

    stories.add(nextStoryId, story);
    nextStoryId += 1;
    story;
  };

  public query ({ caller }) func getStories() : async [Story] {
    let iter = stories.values();
    iter.toArray().sort(Story.compareByCreatedAt);
  };

  public query ({ caller }) func getStory(id : Nat) : async ?Story {
    stories.get(id);
  };

  public shared ({ caller }) func likeStory(id : Nat) : async ?Story {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can like stories");
    };

    switch (stories.get(id)) {
      case (null) { null };
      case (?story) {
        let updatedStory = {
          id = story.id;
          authorPrincipal = story.authorPrincipal;
          authorName = story.authorName;
          title = story.title;
          body = story.body;
          workCategory = story.workCategory;
          earningsAmount = story.earningsAmount;
          createdAt = story.createdAt;
          likes = story.likes + 1;
        };
        stories.add(id, updatedStory);
        ?updatedStory;
      };
    };
  };

  public query ({ caller }) func getStoriesByAuthor(author : Principal) : async [Story] {
    let filteredStories = List.empty<Story>();
    for (story in stories.values()) {
      if (Principal.equal(story.authorPrincipal, author)) {
        filteredStories.add(story);
      };
    };
    filteredStories.toArray().sort(Story.compareByCreatedAt);
  };

  public shared ({ caller }) func setDisplayName(name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set display names");
    };

    let trimmed = name.trim(#char ' ');
    if (trimmed.size() == 0) {
      Runtime.trap("Display name cannot be empty");
    };
    displayNames.add(caller, trimmed);
  };

  public query ({ caller }) func getDisplayName(p : Principal) : async ?Text {
    displayNames.get(p);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Helper function to add seed stories
  system func preupgrade() {
    if (stories.isEmpty()) {
      let sampleStories = [
        {
          title = "First delivery as a cyclist";
          body = "Today I delivered packages on my bike for the first time. Great exercise and quite fun!";
          workCategory = "Delivery";
          earningsAmount = "€20";
        },
        {
          title = "Night troubleshooting";
          body = "Got called to fix a computer at 2am. Customer happy, I got some extra cash!";
          workCategory = "IT Support";
          earningsAmount = "€50";
        },
        {
          title = "Homemade dish to go";
          body = "Sold homemade lasagna to a neighbor. She loved it and paid extra!";
          workCategory = "Food Service";
          earningsAmount = "€30";
        },
        {
          title = "Long shift in the bakery";
          body = "Worked a 12 hour shift in the bakery today. Hard but rewarding work!";
          workCategory = "Bakery";
          earningsAmount = "€120";
        },
      ];

      for (sample in sampleStories.values()) {
        let story : Story = {
          id = nextStoryId;
          authorPrincipal = Principal.fromText("2vxsx-fae");
          authorName = "Seed Author";
          title = sample.title;
          body = sample.body;
          workCategory = sample.workCategory;
          earningsAmount = sample.earningsAmount;
          createdAt = Time.now();
          likes = 0;
        };
        stories.add(nextStoryId, story);
        nextStoryId += 1;
      };
    };
  };
};
